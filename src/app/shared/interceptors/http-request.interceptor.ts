import { ConferenceService } from './../services/conference.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import * as _ from 'lodash';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { IResultHttp } from '../interfaces/IResultHttp';

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
          const cloneEvent = event.clone({
            body: {
              success: true,
              data: event.body || [],
              error: undefined
            }
          });
          return cloneEvent;
        }
      }),

      catchError((error: HttpErrorResponse) => {
        if (error.status === 422) {
          this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: error.error.erro });
        } else if (error.status === 400) {
          const messages = [];
          if (Array.isArray(error.error)) {
            error.error.forEach(m => { messages.push(`${_.get(m, 'propriedade', '').toUpperCase()} ${m.erro}`); });
          } else {
            messages.push(_.get(error, 'error.erro', 'Não conseguimos processar sua solicitação'));
          }
          this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: messages.join('<br />') });
        } else if (error.status === 401) {
          setTimeout(() => {
            this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Sua sessão expirou' });
          }, 1000);
          this.router.navigate([`/login/${this.conferenceSrv.ConferenceActiveId}`]);
        } else {
          this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Houve um erro ao processar sua solicitação' });
        }

        return throwError({ success: false, data: [{ ...error }], error: error.message });
      }),
      finalize(() => {
        this.loadingService.loading(false);
      })
    );
  }
}


