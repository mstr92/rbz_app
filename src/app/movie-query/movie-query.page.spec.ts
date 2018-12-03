import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieQueryPage } from './movie-query.page';

describe('MovieQueryPage', () => {
  let component: MovieQueryPage;
  let fixture: ComponentFixture<MovieQueryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieQueryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieQueryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
