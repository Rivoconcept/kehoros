import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarCollaboratorsComponent } from './navbar-collaborators.component';

describe('NavbarCollaboratorsComponent', () => {
  let component: NavbarCollaboratorsComponent;
  let fixture: ComponentFixture<NavbarCollaboratorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarCollaboratorsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(NavbarCollaboratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
