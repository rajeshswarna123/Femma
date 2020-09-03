import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { ErrorsHandler } from '../services/error-handler.service';
import { LoggerService } from '../services/logger.service';
import { SecuredStorageProviderService } from '../services/secured-storage-provider.service';

@Injectable()
export class HttpInterceptors implements HttpInterceptor {

  private loggerService: LoggerService;
  private errorsHandler: ErrorsHandler;
  private securedStorageProvider: SecuredStorageProviderService;

  constructor(private readonly injector: Injector) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loggerService = this.injector.get<LoggerService>(LoggerService);
    this.errorsHandler = this.injector.get<ErrorsHandler>(ErrorsHandler);
    this.securedStorageProvider = this.injector.get<SecuredStorageProviderService>(SecuredStorageProviderService);

    // let headers = new HttpHeaders();
    const started = Date.now();
    let ok: string;

    // headers = headers.append('Content-Type', 'application/xml');
    //
    // request = request.clone({headers: headers});
    return next.handle(request)
      .pipe(
        tap(
          // Succeeds when there is a response; ignore other events
          event => ok = event instanceof HttpResponse ? 'succeeded' : '',
          // Operation failed; error is an HttpErrorResponse
          () => {
            ok = 'failed';
          }
        ),
        // Log when response observable either completes or errors
        finalize(() => {
          const elapsed = Date.now() - started;
          const msg = `${request.method} "${request.urlWithParams}"
             ${ok} in ${elapsed} ms.`;
          try {
            this.loggerService.info(msg, request, 'HttpInterceptors', 'intercept');
          } catch (e) {
            this.errorsHandler.handleError(e);
          }
        })
      );
  }

}
