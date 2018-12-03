import { TestBed, inject } from '@angular/core/testing';

import { FavouritesService } from './favourites.service';

describe('FavouritesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FavouritesService]
    });
  });

  it('should be created', inject([FavouritesService], (service: FavouritesService) => {
    expect(service).toBeTruthy();
  }));
});
