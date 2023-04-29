import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignadoComponent } from './asignado.component';

describe('AsignadoComponent', () => {
  let component: AsignadoComponent;
  let fixture: ComponentFixture<AsignadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
