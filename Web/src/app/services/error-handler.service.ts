import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { NavigationError, Router } from '@angular/router';
import { LoggerService } from './logger.service';

@Injectable()
export class ErrorsHandler implements ErrorHandler {

  constructor(private readonly injector: Injector) {
  }

  handleError(error: Error | HttpErrorResponse): void {
    console.log(error);
    const router = this.injector.get<Router>(Router);
    const loggerService = this.injector.get<LoggerService>(LoggerService);

    if (error instanceof HttpErrorResponse) {
      if (!navigator.onLine) {
        // alert('Connectivity lost! Please check your internet connection.');
      } else {
        loggerService.error(
          error,
          'Unhandled HttpErrorResponse error',
          {},
          'handleError',
          'ErrorsHandler'
        );
        router.navigate(['/']);
      }
    } else if (event instanceof NavigationError) {
      loggerService.error(
        error,
        'Unhandled Navigation Error Caught In ErrorHandler',
        {},
        'handleError',
        'ErrorsHandler'
      );
    } else {
      loggerService.error(
        error,
        'Unhandled Error Caught In ErrorHandler',
        {},
        'handleError',
        'ErrorsHandler'
      );
    }
  }

}
