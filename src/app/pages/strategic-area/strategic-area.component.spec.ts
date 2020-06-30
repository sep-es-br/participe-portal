import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategicAreaComponent } from './strategic-area.component';

describe('StrategicAreaComponent', () => {
  let component: StrategicAreaComponent;
  let fixture: ComponentFixture<StrategicAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrategicAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategicAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
