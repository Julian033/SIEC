import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAsignadoComponent } from './manage-asignado.component';

describe('ManageAsignadoComponent', () => {
  let component: ManageAsignadoComponent;
  let fixture: ComponentFixture<ManageAsignadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAsignadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAsignadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
