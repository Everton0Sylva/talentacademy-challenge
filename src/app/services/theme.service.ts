import { Injectable } from '@angular/core';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  constructor() {
  }
  private themeSubject = new BehaviorSubject<string>('');

  private theme!: string;

  private setTheme(theme: string) {
    document.body.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    this.theme = theme;
  }

  getTheme(): Observable<string> {
    if (!this.theme) {
      let theme = localStorage.getItem('theme');
      if (theme) {
        this.setTheme(theme);
        this.themeSubject.next(theme)
      } else if (!theme) this.changeTheme();
    }
    return this.themeSubject.asObservable();
  }

  changeTheme() {
    const theme = this.theme == 'light' ? 'dark' : 'light';
    this.setTheme(theme);
    this.themeSubject.next(theme)
  }

  //LANGUAGE
  private languageSubject = new BehaviorSubject<string>('');
  private language!: string;

  public setLanguage(language: string) {
    if (!this.language) {
      let lang = localStorage.getItem('language');
      if (!lang) {
        localStorage.setItem('language', language);
        this.language = language;
      } else this.language = lang;
    }
    if (this.language != language) {
      localStorage.setItem('language', language);
      this.language = language;
    }

    this.languageSubject.next(this.language);
  }

  public currentLanguage(): string {
    return this.language ?? localStorage.getItem('language');

  }

  public getLanguage() {
    return this.languageSubject.asObservable();
  }


  ngOnDestroy() {
    this.themeSubject.complete();
    this.languageSubject.complete();
  }

}
