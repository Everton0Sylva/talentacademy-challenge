import { Injectable } from '@angular/core';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private alertConfig: AlertConfig) {
    this.alertConfig.dismissible = false;
    this.alertConfig.dismissOnTimeout = 5000;
  }
  private alertSubject = new BehaviorSubject<{
    text: string; type: 'success' | 'error'
  }[]>([]);

  alert$ = this.alertSubject.asObservable();

  public success(text: string): void {
    const currentAlerts = this.alertSubject.value;
    this.alertSubject.next([...currentAlerts, { text, type: "success" }]);
  }

  public error(text: string): void {
    const currentAlerts = this.alertSubject.value;
    this.alertSubject.next([...currentAlerts, { text, type: "error" }]);
  }
}
