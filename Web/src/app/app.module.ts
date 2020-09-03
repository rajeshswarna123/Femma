import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AlertComponent } from './components/alert/alert.component';
import { AppComponent } from './components/app.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HttpInterceptors } from './http-interceptors/http-interceptors';
import { AlertService } from './services/alert.service';
import { BackendService } from './services/backend.service';
import { ErrorsHandler } from './services/error-handler.service';
import { LoggerService } from './services/logger.service';
import { SecuredStorageProviderService } from './services/secured-storage-provider.service';
import { HomeComponent } from './components/home/home.component';


@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    PageNotFoundComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    AppRoutingModule
  ],
  providers: [
    AlertService,
    BackendService,
    ErrorsHandler,
    LoggerService,
    SecuredStorageProviderService,
    {provide: ErrorHandler, useClass: ErrorsHandler},
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptors, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
