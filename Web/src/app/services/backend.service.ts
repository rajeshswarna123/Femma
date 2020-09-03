import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { mapTo, retryWhen, tap } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { ErrorsHandler } from './error-handler.service';

@Injectable()
export class BackendService {

  baseUrl: string;
  private onlineChanges$ = fromEvent(window, 'online').pipe(mapTo(true));

  constructor(private readonly httpClient: HttpClient,
              private readonly errorsHandler: ErrorsHandler) {
    this.baseUrl = environment.apiBaseUrl;
  }

  get isOnline() {
    return navigator.onLine;
  }

  async get(url: string, retryIfOffline: boolean = false): Promise<any> {
    return this.httpClient.get(url, {responseType: 'json'})
      .pipe(
        retryWhen(errors => {
          if (!this.isOnline && retryIfOffline) {
            return this.onlineChanges$;
          }

          errors.pipe(tap(error => this.errorsHandler.handleError(error)));
        })
      ).toPromise();
  }

  async post(url: string, body: any, retryIfOffline: boolean = false): Promise<any> {
    return this.httpClient.post(this.baseUrl + url, body, {responseType: 'json'})
      .pipe(
        retryWhen(errors => {
          if (!this.isOnline && retryIfOffline) {
            return this.onlineChanges$;
          }

          errors.pipe(tap(error => this.errorsHandler.handleError(error)));
        })
      ).toPromise();
  }

  async put(url: string, body: any): Promise<any> {
    return this.httpClient.put(this.baseUrl + url, body, {responseType: 'json'}).toPromise();
  }

}
