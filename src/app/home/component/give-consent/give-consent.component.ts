import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AlertService } from '../../../services/alert.service';
import { timer } from 'rxjs';
import { HttprequestService } from '../../../services/httprequest.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-give-consent',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe],
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



  private translate: TranslateService = inject(TranslateService);
  private alertService: AlertService = inject(AlertService);
  private httprequestService: HttprequestService = inject(HttprequestService);

  constructor(private spinner: NgxSpinnerService) {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      consents: new FormGroup({
        newsletter: new FormControl(false),
        ads: new FormControl(false),
        anonymous: new FormControl(false),
      })
    })

   /* this.spinner.show();
    timer(2000).subscribe(() => {
      this.spinner.hide();
    });*/
  }

  public isSubmitted: boolean = false;

  showError() {
    if (this.isSubmitted && this.form.invalid) {
      this.isSubmitted = false;
    }
  }

  submit() {
    this.isSubmitted = false;

    if (this.form.invalid) {
      this.isSubmitted = true;
      return;
    };
    this.spinner.show();
    const formData = this.form.value;
    this.httprequestService.post('/consents', formData).subscribe({
      next: (response) => {
        timer(1000).subscribe(() => {
          this.spinner.hide();
          this.alertService.success(this.translate.instant('consent-success'));
        });
      },
      error: (error) => {
        timer(3000).subscribe(() => {
          this.spinner.hide();
          this.alertService.error(this.translate.instant('consent-error'));
        });
      }
    });
  }
}
