import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieResultWaitingPage } from './movie-result-waiting.page';

describe('MovieResultWaitingPage', () => {
  let component: MovieResultWaitingPage;
  let fixture: ComponentFixture<MovieResultWaitingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovieResultWaitingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovieResultWaitingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
