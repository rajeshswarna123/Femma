import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TokenModel } from '../models/token-model';

@Injectable()
export class SecuredStorageProviderService {

  static readonly AuthTokenKey = '_AuthTokenKey';

  constructor() {
  }

  public setAuthToken(authToken: TokenModel): void {
    if (authToken === null) {
      this.setCookie(SecuredStorageProviderService.AuthTokenKey, null);
    } else {
      const payload = this.getJwtPayload(authToken.accessToken);
      const orgData = {memberkey: payload.mem, orgkey: payload.org, memberType: payload.typ, termsAccepted: payload.trmsAccptd};
      const data = {token: authToken, orgData: orgData};
      this.setCookie(SecuredStorageProviderService.AuthTokenKey, JSON.stringify(data));
    }
  }

  public getAuthToken(): string {
    const token = this.getCookie(SecuredStorageProviderService.AuthTokenKey);
    if (token) {
      return JSON.parse(token).token;
    }

    return null;
  }

  public setCookie(name: string, value: string, days: number = 3650, domain: string = environment.cookieDomain): void {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + (value || '') + expires + '; path=/' + '; domain=' + domain;
  }

  public getCookie(name: string): string {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }

  private getJwtPayload(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }
}
