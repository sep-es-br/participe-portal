import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConferenceMapComponent } from './conference-map.component';

describe('ConferenceMapComponent', () => {
  let component: ConferenceMapComponent;
  let fixture: ComponentFixture<ConferenceMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConferenceMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConferenceMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
