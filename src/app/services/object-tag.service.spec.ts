import { TestBed } from '@angular/core/testing';

import { ObjectTagService } from './object-tag.service';

describe('ObjectTagService', () => {
  let service: ObjectTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjectTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
