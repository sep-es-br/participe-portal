import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamCredentialComponent } from './team-credential.component';

describe('TeamCredentialComponent', () => {
  let component: TeamCredentialComponent;
  let fixture: ComponentFixture<TeamCredentialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamCredentialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
