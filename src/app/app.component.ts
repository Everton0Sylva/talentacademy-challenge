import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AlertComponent } from './components/alert/alert';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, AlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private theme: string = 'light';

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['en', 'pt']);
    this.translate.setDefaultLang('pt');
    this.translate.use('pt');
  }

  setTheme(theme: string) {
    document.body.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }

  getTheme(): string {
    return localStorage.getItem('theme') || this.theme;
  }

  ngOnInit() {
    this.setTheme(this.getTheme());
  }

  onChangeTheme() {
    const theme = this.getTheme() == 'light' ? 'dark' : 'light';
    this.setTheme(theme);
  }

  onOpenLink() {
    window.open('https://github.com/Everton0Sylva', '_blank', 'noopener,noreferrer');
  }

}