import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParticipationsComponent } from './participations.component';

describe('ParticipationsComponent', () => {
  let component: ParticipationsComponent;
  let fixture: ComponentFixture<ParticipationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
