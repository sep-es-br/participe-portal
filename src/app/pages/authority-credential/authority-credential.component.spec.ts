import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityCredentialComponent } from './authority-credential.component';

describe('AuthorityCredentialComponent', () => {
  let component: AuthorityCredentialComponent;
  let fixture: ComponentFixture<AuthorityCredentialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityCredentialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthorityCredentialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
