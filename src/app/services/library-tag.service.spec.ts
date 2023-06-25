import { TestBed } from '@angular/core/testing';

import { LibraryTagService } from './library-tag.service';

describe('LibraryTagService', () => {
  let service: LibraryTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibraryTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
