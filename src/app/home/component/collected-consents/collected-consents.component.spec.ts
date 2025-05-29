import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectedConsentsComponent } from './collected-consents.component';

describe('CollectedConsentsComponent', () => {
  let component: CollectedConsentsComponent;
  let fixture: ComponentFixture<CollectedConsentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectedConsentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectedConsentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
