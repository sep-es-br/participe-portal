import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Inject, Injectable, Injector } from '@angular/core';
import { IQueryOptions } from '../interfaces/IQueryOptions';
import { IResultPaginated } from '../interfaces/IResultPaginated';
import { IResultHttp } from '../interfaces/IResultHttp';
import { PrepareHttpQuery } from '../utils/query.utils';
import * as _ from 'lodash';

@Injectable({providedIn: "root"})
export abstract class BaseService<T> {

    urlBase: string = '';
    http: HttpClient;
    confirmationSrv: ConfirmationService;
    messageSrv: MessageService;
    private readonly urlBaseOriginal: string;

    constructor(
        public url: string,
        @Inject(Injector) injector: Injector
    ) {
        this.urlBase = `${environment.apiUrl}/${this.url}`;
        this.urlBaseOriginal = `${environment.apiUrl}/${this.url}`;
        this.http = injector.get(HttpClient);
        this.confirmationSrv = injector.get(ConfirmationService);
        this.messageSrv = injector.get(MessageService);
    }

    setParamsFromUrl(fields: string[], values: any[]) {
        this.urlBase = this.urlBaseOriginal;
        fields.forEach((f, i) => {
            this.urlBase = this.urlBase.replace(f, values[i]);
        });
    }

    public async GetAll(options?: IQueryOptions): Promise<IResultPaginated<T>> {
        const { success, data } = await
            this.http.get<IResultHttp<IResultPaginated<T>>>(`${this.urlBase}${PrepareHttpQuery(options)}`).toPromise();
        if (success) {
            return data;
        } else {
            return undefined;
        }
    }

    public async GetById(id: number): Promise<IResultHttp<T>> {
        const result = await this.http.get(`${this.urlBase}/${id}`).toPromise();
        return result as IResultHttp<T>;
    }

    public post(model: T): Promise<IResultHttp<T>> {
        return this.http.post(this.urlBase, model).toPromise() as Promise<IResultHttp<T>>;
    }

    public put(model: T, id: number): Promise<IResultHttp<T>> {
        return this.http.put(`${this.urlBase}/${id}`, model).toPromise() as Promise<IResultHttp<T>>;
    }

    public async delete(model: T, options?: { message?: string, field?: string, useConfirm?: boolean }) {
        const message = _.get(options, 'message');
        const field: string = _.get(options, 'field');
        const useConfirm: boolean = _.get(options, 'useConfirm', true);

        return new Promise(async (resolve, reject) => {
            if (useConfirm) {
                this.confirmationSrv.confirm({
                    message: message || `Deseja realmente excluir o(a) ${model[field ? field : 'nome']}?`,
                    key: 'deleteConfirm',
                    acceptLabel: 'Sim',
                    rejectLabel: 'Não',
                    accept: async () => {
                        try {
                            const result = await this.http.delete(`${this.urlBase}/${model['id']}`).toPromise();
                            setTimeout(() => {
                                this.messageSrv.add({ severity: 'success', summary: 'Sucesso', detail: 'Registro excluído com sucesso', life: 15000 })
                            }, 300);
                            resolve(result['success']);
                        } catch (error) {
                            reject(error);
                            console.error(`delete-${this.url}-${model['id']}-reason:`, error);
                        }
                    },
                    reject: () => {
                        resolve(false);
                    }
                });
            } else {
                try {
                    const result = await this.http.delete(`${this.urlBase}/${model['id']}`).toPromise();
                    resolve(result['success']);
                } catch (error) {
                    reject(error);
                    console.error(`delete-${this.url}-${model['id']}-reason:`, error);
                }
            }
        });
    }
}
