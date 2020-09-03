import { Injectable } from '@angular/core';
import { BrowserClient, Hub } from '@sentry/browser';
import * as _ from 'lodash';
import * as mixpanel from 'mixpanel-browser';
import { environment } from '../../environments/environment';
import * as moment from 'moment';
import { LoggerLevel } from '../enums/logger-level.enum';

@Injectable()
export class LoggerService {

  private _isInitialized = false;
  private isRemoteLoggingEnabled = false;
  private readonly _logsBeforeInitialization: any[] = [];
  private readonly baseUrl: string;
  private hub: Hub;

  constructor() {
    this.baseUrl = environment.apiBaseUrl;
    this.init();
  }

  public init(): void {
    if (this._isInitialized) {
      return;
    }

    if (environment.envName !== 'local') {
      this.configure();
      // Disable remote logging as this is the blueprint project.
      this.isRemoteLoggingEnabled = false;
    }

    this._isInitialized = true;

    if (this._logsBeforeInitialization.length > 0) {
      for (const logData of this._logsBeforeInitialization) {
        this.log(null, logData.logMsg, logData.logLevel, logData.logData, logData.logCallerTypeName, logData.logCallerMethodName);
        this._logsBeforeInitialization.pop();
      }
    }
  }

  public setUser(emailId: string): void {
    if (this.isRemoteLoggingEnabled) {
      mixpanel.identify(emailId);
      mixpanel.register({
        '$distinct_id': emailId
      });
    } else {
      return;
    }
  }

  public setUserAlias(newId: string): void {
    if (this.isRemoteLoggingEnabled) {
      mixpanel.alias(newId);
    } else {
      return;
    }
  }

  public setUserProperties(firstName: string, lastName: string, email: string, phone: string): void {
    if (this.isRemoteLoggingEnabled) {
      mixpanel.people.set({
        '$first_name': firstName,
        '$last_name': lastName,
        '$phone': phone,
        '$email': email,
        '$created': moment(new Date()).format()
      });
    } else {
      return;
    }
  }

  public setUserProperty(propertyName: string, propertyValue: string): void {
    if (this.isRemoteLoggingEnabled) {
      const propertyObject = {};
      propertyObject[propertyName] = propertyValue;
      mixpanel.people.set(propertyObject);
    } else {
      return;
    }
  }

  public event(msg: string, data: object = null, callerTypeName: string = null, callerMethodName: string = null): void {
    this.log(null, msg, LoggerLevel.Event, data, callerTypeName, callerMethodName);
  }

  public info(msg: string, data: object = null, callerTypeName: string = null, callerMethodName: string = null): void {
    this.log(null, msg, LoggerLevel.Info, data, callerTypeName, callerMethodName);
  }

  public error(err: any, msg: string, data: object = null, callerTypeName: string = null, callerMethodName: string = null): void {
    this.log(err, msg, LoggerLevel.Error, data, callerTypeName, callerMethodName);
  }

  public debug(msg: string, data: object = null, callerTypeName: string = null, callerMethodName: string = null): void {
    this.log(null, msg, LoggerLevel.Debug, data, callerTypeName, callerMethodName);
  }

  private log(error: any, msg: string, level: LoggerLevel, data: object, callerTypeName: string, callerMethodName: string): void {
    if (!this._isInitialized) {
      this._logsBeforeInitialization.push({
        logError: error,
        logMsg: msg,
        logLevel: level,
        logData: data,
        logCallerTypeName: callerTypeName,
        logCallerMethodName: callerMethodName
      });
      return;
    }

    const metadata = {};
    if (data !== null) {
      metadata['data'] = _.cloneDeep(data);
    }

    metadata['callerTypeName'] = callerTypeName;
    metadata['callerMethodName'] = callerMethodName;

    const logEntry = {
      message: msg,
      level: level.toString().toLowerCase(),
      data: metadata
    };

    if (!this.isRemoteLoggingEnabled) {
      console.log(JSON.stringify(logEntry));
      return;
    }

    this.hub.addBreadcrumb({
      message: logEntry.message,
      data: logEntry.data
    });

    if (level === 'Event') {
      mixpanel.track(
        logEntry.message,
        logEntry.data
      );
    }

    this.hub.addBreadcrumb({
      message: logEntry.message,
      data: logEntry.data
    });

    if (level === 'Error') {
      this.hub.captureException(error);
    }

  }

  private configure(): void {
    const client = new BrowserClient({
      dsn: environment.sentryIOUrl,
      release: environment.siteVersion
    });
    this.hub = new Hub(client);
    this.hub.configureScope(scope => {
      scope.setTag('environment', environment.envName);
    });

    mixpanel.init(environment.mixpanelToken);
    mixpanel.register({environment: environment.envName});
  }
}
