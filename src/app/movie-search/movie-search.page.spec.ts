import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieSearchPage } from './movie-search.page';

describe('MovieSearchPage', () => {
  let component: MovieSearchPage;
  let fixture: ComponentFixture<MovieSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieSearchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
