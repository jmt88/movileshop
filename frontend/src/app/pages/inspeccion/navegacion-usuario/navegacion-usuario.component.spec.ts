import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavegacionUsuarioComponent } from './navegacion-usuario.component';

describe('NavegacionUsuarioComponent', () => {
  let component: NavegacionUsuarioComponent;
  let fixture: ComponentFixture<NavegacionUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavegacionUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavegacionUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
