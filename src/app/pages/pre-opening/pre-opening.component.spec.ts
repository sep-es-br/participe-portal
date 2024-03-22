import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PreOpeningComponent } from './pre-opening.component';

describe('PreOpeningComponent', () => {
  let component: PreOpeningComponent;
  let fixture: ComponentFixture<PreOpeningComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreOpeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreOpeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
