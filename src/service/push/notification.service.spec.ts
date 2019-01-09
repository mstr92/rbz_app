import { TestBed, inject } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe('PushService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationService]
    });
  });

  it('should be created', inject([NotificationService], (service: NotificationService) => {
    expect(service).toBeTruthy();
  }));
});
