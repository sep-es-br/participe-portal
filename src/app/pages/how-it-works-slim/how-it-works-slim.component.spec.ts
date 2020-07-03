import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowItWorksSlimComponent } from './how-it-works-slim.component';

describe('HowItWorksSlimComponent', () => {
  let component: HowItWorksSlimComponent;
  let fixture: ComponentFixture<HowItWorksSlimComponent>;

  beforeEach(async(() => {
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
