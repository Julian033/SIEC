import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSoftwareComponent } from './manage-software.component';

describe('ManageSoftwareComponent', () => {
  let component: ManageSoftwareComponent;
  let fixture: ComponentFixture<ManageSoftwareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageSoftwareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSoftwareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
