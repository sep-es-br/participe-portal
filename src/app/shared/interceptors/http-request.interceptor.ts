import {ConferenceService} from '../services/conference.service';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, finalize, map} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import * as _ from 'lodash';
import {AuthService} from '../services/auth.service';
import {LoadingService} from '../services/loading.service';
import {IResultHttp} from '../interfaces/IResultHttp';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private messageService: MessageService,
    private conferenceSrv: ConferenceService,
    private router: Router
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<IResultHttp<any>>> {

    this.loadingService.loading(true);

    const accessToken = this.authService.getAccessToken();
    const headers = new HttpHeaders({
      Authorization: accessToken ? `Bearer ${accessToken}` : '',
      'Content-Type': 'application/json'
    });

    req = req.clone({ headers });
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          return event.clone({
            body: {
              success: true,
              data: event.body || [],
              error: undefined
            }
          });
        }
      }),

      catchError((error: HttpErrorResponse) => {
        let message = '';
        const { status: StatusCode } = error;
        switch (StatusCode) {
          case 422:
            message = _.get(error, 'error.erro', 'Não conseguimos processar sua solicitação');
            break;
          case 400:
            const messages = [];
            if (_.isArray(error.error)) {
              error.error.forEach(m => { messages.push(`${_.get(m, 'propriedade', '').toUpperCase()} ${m.erro}`); });
            } else {
              messages.push(
                _.get(error, 'error.erro',
                  _.get(error, 'error.message', 'Não conseguimos processar sua solicitação')
                )
              );
            }
            message = messages.join('<br />');
            break;
          case 401:
            message = 'Sua sessão expirou';
            this.router.navigate([`/login/${this.conferenceSrv.ConferenceActiveId}`]).then();
            break;
          case 403:
            message = _.get(error, 'error.message', 'Não autorizado');
            break;
          default:
            message = _.get(error, 'error.message', 'Houve um erro ao processar sua solicitação');
            break;
        }
        setTimeout(() => {
          this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: message, life: 15000 });
        }, 500);

        return throwError({ success: false, data: [{ ...error }], error: error.message });
      }),
      finalize(() => {
        this.loadingService.loading(false);
      })
    );
  }
}


