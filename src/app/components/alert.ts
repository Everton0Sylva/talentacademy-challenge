import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AlertService } from '../services/alert.service';

@Component({
    selector: 'app-alert',
    standalone: true,
    imports: [
        AlertModule,
        CommonModule,
        TranslatePipe
    ],
    template: `
        <div class="floartingalert">
         <alert [type]="alert.type"  *ngFor="let alert of alerts; let i = index">
         <div class="d-flex flex-row align-items-center">
         <i class="bi bi-check-square-fill text-success fs-4 me-2" *ngIf="alert.type == 'success'"></i>
         <i class="bi  bi-x-square-fill text-danger fs-4 me-2"  *ngIf="alert.type == 'danger'"></i>{{alert.text}}</div>
        </alert>
        </div>
`,
    styles: [`
.floartingalert {
     position: fixed;
  top: 15px;
  right: 15px;
  z-index: 1050;
} `]
})
export class AlertComponent {

    alerts = [{
        text: '',
        type: 'success' as 'success' | 'danger'
    }]

    constructor(private alert: AlertService) {
        this.alert.alert$.subscribe(alerts => {
            this.alerts = alerts.map(alert => {
                return {
                    text: alert?.text || '',
                    type: alert?.type == 'success' ? 'success' : 'danger'
                }
            })
        });
    }
}
