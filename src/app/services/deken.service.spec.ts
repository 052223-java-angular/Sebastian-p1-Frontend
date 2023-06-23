import { TestBed } from '@angular/core/testing';

import { DekenService } from './deken.service';

describe('DekenService', () => {
  let service: DekenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DekenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
