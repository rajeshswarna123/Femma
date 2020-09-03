import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { AlertService } from '../../services/alert.service';
import { AlertModel } from '../../models/alert-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from '../../base.component';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent extends BaseComponent implements OnInit, OnDestroy {
  public alertNotifications: AlertModel[];

  constructor(
    private injector: Injector,
    private readonly alertService: AlertService,
    private readonly snackBar: MatSnackBar) {
    super('', injector);
  }

  ngOnInit() {
    this.subscribeToAlerts();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  subscribeToAlerts(): void {
    this.subscriptionsToDestroy.push(
      this.alertService.getAlert().subscribe((alert: AlertModel) => {
        if (!alert) {
          this.alertNotifications = null;
          return;
        }
        this.openSnackBar(alert.message, 'OK');
        this.openSnackBar(alert.message, 'OK');
      }));
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
