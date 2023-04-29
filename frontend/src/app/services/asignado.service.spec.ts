import { TestBed } from '@angular/core/testing';

import { AsignadoService } from './asignado.service';

describe('AsignadoService', () => {
  let service: AsignadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AsignadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
