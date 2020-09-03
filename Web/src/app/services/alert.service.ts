import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AlertModel } from '../models/alert-model';
import { AlertTypeEnum } from '../enums/alert-type.enum';

@Injectable()
export class AlertService {
  private readonly subject = new Subject<AlertModel>();
  private keepAfterRouteChange = false;

  constructor(private readonly router: Router) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterRouteChange) {
          this.keepAfterRouteChange = false;
        } else {
          this.clear();
        }
      }
    });
  }

  getAlert(): Observable<any> {
    return this.subject.asObservable();
  }

  error(message: string, autoHide: number = 10000, keepAfterRouteChange: boolean = false): void {
    this.alert(AlertTypeEnum.Error, message, autoHide, keepAfterRouteChange);
  }

  warning(message: string, autoHide: number = 10000, keepAfterRouteChange: boolean = false): void {
    this.alert(AlertTypeEnum.Warning, message, autoHide, keepAfterRouteChange);
  }

  info(message: string, autoHide: number = 5000, keepAfterRouteChange: boolean = false): void {
    this.alert(AlertTypeEnum.Info, message, autoHide, keepAfterRouteChange);
  }

  alert(type: AlertTypeEnum, message: string, autoHide: number, keepAfterRouteChange: boolean = false): void {
    this.keepAfterRouteChange = keepAfterRouteChange;
    this.subject.next({
      type: type,
      message: message,
    });
  }

  clear(): void {
    this.subject.next();
  }
}
