import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavegacionIpComponent } from './navegacion-ip.component';

describe('NavegacionIpComponent', () => {
  let component: NavegacionIpComponent;
  let fixture: ComponentFixture<NavegacionIpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavegacionIpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavegacionIpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
