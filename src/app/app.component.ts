import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TranslateDirective, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AlertComponent } from './components/alert/alert';
import { ThemeService } from './services/theme.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HttprequestService } from './services/httprequest.service';
import { map, Subject, takeUntil, timer } from 'rxjs';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, AlertComponent, BsDropdownModule, TranslatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public destroy$ = new Subject<void>();
  theme!: string;

  languages: { lang: string, flag: string }[] = [];

  constructor(private translate: TranslateService, private themeService: ThemeService, private httprequestService: HttprequestService,
    private cdRef: ChangeDetectorRef) {
    this.translate.addLangs(['en', 'pt']);
    this.translate.setDefaultLang('pt');
  }
  ngAfterViewInit() {
    timer(100).pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.themeService.getTheme().pipe(takeUntil(this.destroy$)).subscribe(theme => {
          this.theme = theme;
        })
      })
  }

  currentFlag!: string;

  ngOnInit(): void {
    let currentLang = this.themeService.currentLanguage();

    this.themeService.setLanguage(currentLang ?? 'pt');

    timer(100).pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.themeService.getLanguage().pipe(takeUntil(this.destroy$)).subscribe(lang => {
          this.translate.use(lang);
        })
      })

    this.translate.onLangChange.subscribe(() => {
      this.cdRef.detectChanges();
    });

    this.languages = [
      { lang: 'pt', flag: "assets/images/br.png" },
      { lang: 'en', flag: "assets/images/us.png" }]

    let flag = this.languages.find(lang => currentLang == lang.lang)?.flag
    this.currentFlag = flag || this.languages[0].flag
    this.setFlagPosition(currentLang);
  }

  onChangeTheme() {
    this.themeService.changeTheme();
  }

  onOpenLink() {
    window.open('https://github.com/Everton0Sylva', '_blank', 'noopener,noreferrer');
  }


  onChangeLang(language: any) {
    this.themeService.setLanguage(language.lang);
    this.currentFlag = language.flag;

    this.setFlagPosition(language.lang);
  }
  setFlagPosition(lang: string) {
    let img = document.getElementsByClassName("btn-flag-img")[0] as HTMLElement;
    if (img) {
      img.style.objectPosition = lang == "pt" ? "center" : "0";
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}