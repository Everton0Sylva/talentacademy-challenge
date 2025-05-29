import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../../services/alert.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-give-consent',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe,],
  templateUrl: './give-consent.component.html',
  styleUrl: './give-consent.component.scss'
})
export class GiveConsentComponent {

  form!: FormGroup;

  consents = [
    'newsletter',
    'ads',
    'anonymous'
  ];

  constructor(private translate: TranslateService) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      consents: new FormGroup({
        newsletter: new FormControl(false),
        ads: new FormControl(false),
        anonymous: new FormControl(false),
      })
    })


    timer(2000).subscribe(() => {
      this.alertService.success(this.translate.instant('consent-success'));
      this.alertService.error(this.translate.instant('consent-error'));
    });
  }


  private alertService: AlertService = inject(AlertService);

  submit() {
    if (this.form.valid) {
      const formData = this.form.value;

      this.alertService.success(this.translate.instant('consent-success'));
    } else {
      alert(this.translate.instant('consent.invalid'));
    }
  }

}
