import { TestBed } from '@angular/core/testing';

import { LibraryService } from './library.service';

describe('LibraryServiceService', () => {
  let service: LibraryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});