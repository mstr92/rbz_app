import { TestBed, inject } from '@angular/core/testing';

import { QuerybuilderService } from './querybuilder.service';

describe('QuerybuilderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuerybuilderService]
    });
  });

  it('should be created', inject([QuerybuilderService], (service: QuerybuilderService) => {
    expect(service).toBeTruthy();
  }));
});
