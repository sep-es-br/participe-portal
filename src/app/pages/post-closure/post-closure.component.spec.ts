import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostClosureComponent } from './post-closure.component';

describe('PostClosureComponent', () => {
  let component: PostClosureComponent;
  let fixture: ComponentFixture<PostClosureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostClosureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
