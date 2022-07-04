import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavegacionDiaComponent } from './navegacion-dia.component';

describe('NavegacionDiaComponent', () => {
  let component: NavegacionDiaComponent;
  let fixture: ComponentFixture<NavegacionDiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavegacionDiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavegacionDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
