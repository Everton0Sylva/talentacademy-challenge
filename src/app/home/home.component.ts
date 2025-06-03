import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateDirective, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ThemeService } from '../services/theme.service';
import { catchError, of, Subscription, timer } from 'rxjs';
import { HttprequestService } from '../services/httprequest.service';
import { Consent } from '../model/consent';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, NgxSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit {
  private subs!: Subscription;

  public bdColor = "";

  private themeService: ThemeService = inject(ThemeService);

  ngAfterViewInit() {
    timer(100).subscribe(() => {
      this.subs = this.themeService.getTheme().subscribe(theme => {
        this.bdColor = theme == 'light' ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.5)"
      })
    })
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}