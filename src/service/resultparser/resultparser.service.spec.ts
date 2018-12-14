import { TestBed, inject } from '@angular/core/testing';

import { ResultparserService } from './resultparser.service';

describe('ResultparserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResultparserService]
    });
  });

  it('should be created', inject([ResultparserService], (service: ResultparserService) => {
    expect(service).toBeTruthy();
  }));
});
