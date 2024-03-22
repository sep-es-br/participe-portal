import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HowItWorksSlimComponent } from './how-it-works-slim.component';

describe('HowItWorksSlimComponent', () => {
  let component: HowItWorksSlimComponent;
  let fixture: ComponentFixture<HowItWorksSlimComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HowItWorksSlimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowItWorksSlimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
