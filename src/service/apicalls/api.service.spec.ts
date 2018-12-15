import { TestBed, inject } from '@angular/core/testing';

import { ApicallsService } from './api.service';

describe('ApicallsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApicallsService]
    });
  });

  it('should be created', inject([ApicallsService], (service: ApicallsService) => {
    expect(service).toBeTruthy();
  }));
});
