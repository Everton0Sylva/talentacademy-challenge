import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveConsentComponent } from './give-consent.component';

describe('GiveConsentComponent', () => {
  let component: GiveConsentComponent;
  let fixture: ComponentFixture<GiveConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiveConsentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiveConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
