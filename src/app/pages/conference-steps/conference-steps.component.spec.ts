import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceStepsComponent } from './conference-steps.component';

describe('ConferenceStepsComponent', () => {
  let component: ConferenceStepsComponent;
  let fixture: ComponentFixture<ConferenceStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConferenceStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConferenceStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
