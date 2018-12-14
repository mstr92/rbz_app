import { TestBed, inject } from '@angular/core/testing';

import { NetworkServiceService } from './network-service.service';

describe('NetworkServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NetworkServiceService]
    });
  });

  it('should be created', inject([NetworkServiceService], (service: NetworkServiceService) => {
    expect(service).toBeTruthy();
  }));
});
