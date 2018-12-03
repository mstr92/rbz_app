import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieResultPage } from './movie-result.page';

describe('MovieResultPage', () => {
  let component: MovieResultPage;
  let fixture: ComponentFixture<MovieResultPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieResultPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
