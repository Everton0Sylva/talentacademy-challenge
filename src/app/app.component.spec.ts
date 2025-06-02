import { type ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing"
import { ChangeDetectorRef } from "@angular/core"
import { provideRouter } from "@angular/router"
import { TranslateModule, TranslateService, type LangChangeEvent } from "@ngx-translate/core"
import { BsDropdownModule } from "ngx-bootstrap/dropdown"
import { of, Subject } from "rxjs"

import { AppComponent } from "./app.component"
import { ThemeService } from "./services/theme.service"
import { HttprequestService } from "./services/httprequest.service"
import { provideAnimations } from "@angular/platform-browser/animations"
import { provideHttpClient } from "@angular/common/http"

describe("AppComponent", () => {
  let component: AppComponent
  let fixture: ComponentFixture<AppComponent>
  let mockTranslateService: jasmine.SpyObj<TranslateService>
  let mockThemeService: jasmine.SpyObj<ThemeService>
  let mockHttprequestService: jasmine.SpyObj<HttprequestService>
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>

  let langChangeSubject: Subject<LangChangeEvent>

  beforeEach(async () => {
    langChangeSubject = new Subject<LangChangeEvent>()

    mockTranslateService = jasmine.createSpyObj("TranslateService", ["addLangs", "setDefaultLang", "use"], {
      onLangChange: langChangeSubject,
    })

    mockThemeService = jasmine.createSpyObj("ThemeService", [
      "getTheme",
      "currentLanguage",
      "setLanguage",
      "getLanguage",
      "changeTheme",
    ])

    mockHttprequestService = jasmine.createSpyObj("HttprequestService", ["get", "post"])
    mockChangeDetectorRef = jasmine.createSpyObj("ChangeDetectorRef", ["detectChanges"])

    // Setup default return values
    mockThemeService.getTheme.and.returnValue(of("light"))
    mockThemeService.currentLanguage.and.returnValue("pt")
    mockThemeService.getLanguage.and.returnValue(of("pt"))

    await TestBed.configureTestingModule({
      imports: [
        AppComponent, // Import the standalone component directly
        TranslateModule.forRoot(),
        BsDropdownModule.forRoot(),
      ],
      providers: [
        provideRouter([]), // Provide router for standalone components
        provideAnimations(), // Provide animations
        provideHttpClient(), // Provide HTTP client
        { provide: TranslateService, useValue: mockTranslateService },
        { provide: ThemeService, useValue: mockThemeService },
        { provide: HttprequestService, useValue: mockHttprequestService },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
  })

  describe("Component Initialization", () => {
    it("should create the component", () => {
      expect(component).toBeTruthy()
    })

    it("should initialize translation service with correct languages", () => {
      expect(mockTranslateService.addLangs).toHaveBeenCalledWith(["en", "pt"])
      expect(mockTranslateService.setDefaultLang).toHaveBeenCalledWith("pt")
    })

    it("should initialize languages array correctly", () => {
      component.ngOnInit()

      expect(component.languages).toEqual([
        { lang: "pt", flag: "assets/images/br.png" },
        { lang: "en", flag: "assets/images/us.png" },
      ])
    })
  })

  describe("ngOnInit", () => {
    beforeEach(() => {
      spyOn(component, "setFlagPosition")
      // Ensure the language change subscription is properly set up
      mockThemeService.getLanguage.and.returnValue(of("pt"))
    })

    it("should set current language from theme service", () => {
      mockThemeService.currentLanguage.and.returnValue("en")

      component.ngOnInit()

      expect(mockThemeService.setLanguage).toHaveBeenCalledWith("en")
    })

    it("should subscribe to language changes and use translate service", fakeAsync(() => {

      mockThemeService.getLanguage.and.returnValue(of("en"))

      component.ngOnInit()
      tick(100)
      expect(mockTranslateService.use).toHaveBeenCalledWith("en")
    }))

    it("should set current flag based on current language", () => {
      mockThemeService.currentLanguage.and.returnValue("en")

      component.ngOnInit()

      expect(component.currentFlag).toBe("assets/images/us.png")
    })

    it("should call setFlagPosition with current language", () => {
      mockThemeService.currentLanguage.and.returnValue("pt")

      component.ngOnInit()

      expect(component.setFlagPosition).toHaveBeenCalledWith("pt")
    })

    it("should handle null current language gracefully", () => {
      mockThemeService.currentLanguage.and.returnValue('pt')

      component.ngOnInit()

      expect(mockThemeService.setLanguage).toHaveBeenCalledWith("pt")
    })
  })

  describe("ngAfterViewInit", () => {
    it("should subscribe to theme changes", fakeAsync(() => {
      const themeSubject = new Subject<string>()
      mockThemeService.getTheme.and.returnValue(themeSubject)

      component.ngAfterViewInit()

      // Wait for the timer to complete
      tick(100)

      themeSubject.next("dark")
      tick(100)

      expect(component.theme).toBe("dark")
    }))
  })

  describe("Theme Management", () => {
    it("should call theme service changeTheme method", () => {
      component.onChangeTheme()

      expect(mockThemeService.changeTheme).toHaveBeenCalled()
    })
  })

  describe("External Link", () => {
    it("should open GitHub link in new tab", () => {
      spyOn(window, "open")

      component.onOpenLink()

      expect(window.open).toHaveBeenCalledWith("https://github.com/Everton0Sylva", "_blank", "noopener,noreferrer")
    })
  })

  describe("Component Cleanup", () => {
    it("should complete destroy subject on ngOnDestroy", () => {
      spyOn(component["destroy$"], "next")
      spyOn(component["destroy$"], "complete")

      component.ngOnDestroy()

      expect(component["destroy$"].next).toHaveBeenCalled()
      expect(component["destroy$"].complete).toHaveBeenCalled()
    })
  })

  describe("Integration Tests", () => {
    it("should handle complete language change flow", () => {
      spyOn(component, "setFlagPosition")
      mockThemeService.currentLanguage.and.returnValue("pt")

      component.ngOnInit()
      fixture.detectChanges()

      const newLanguage = { lang: "en", flag: "assets/images/us.png" }
      component.onChangeLang(newLanguage)

      expect(mockThemeService.setLanguage).toHaveBeenCalledWith("pt")
      expect(mockThemeService.setLanguage).toHaveBeenCalledWith("en")
      expect(component.currentFlag).toBe("assets/images/us.png")
    })
  })

  describe("Error Handling", () => {
    it("should handle language not found in languages array", () => {
      mockThemeService.currentLanguage.and.returnValue("fr") // French not in array

      component.ngOnInit()

      expect(component.currentFlag).toBe("assets/images/br.png") // Should fallback to first language
    })

    it("should handle empty languages array", () => {
      component.languages = []
      mockThemeService.currentLanguage.and.returnValue("pt")

      expect(() => component.ngOnInit()).not.toThrow()
    })
  })

  describe("Subscription Management", () => {
    it("should unsubscribe from all observables on destroy", fakeAsync(() => {
      const themeSubject = new Subject<string>()
      const languageSubject = new Subject<string>()

      mockThemeService.getTheme.and.returnValue(themeSubject)
      mockThemeService.getLanguage.and.returnValue(languageSubject)

      component.ngOnInit()
      component.ngAfterViewInit()

      tick(100)

      // Verify subscriptions are active
      expect(themeSubject.observers.length).toBeGreaterThan(0)
      expect(languageSubject.observers.length).toBeGreaterThan(0)

      // Destroy component
      component.ngOnDestroy()
      tick(100)

      // Verify subscriptions are cleaned up
      expect(themeSubject.observers.length).toBe(0)
      expect(languageSubject.observers.length).toBe(0)
    }))
  })
})
