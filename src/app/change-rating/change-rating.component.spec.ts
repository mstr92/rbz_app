import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeRatingComponent } from './change-rating.component';

describe('ChangeRatingComponent', () => {
  let component: ChangeRatingComponent;
  let fixture: ComponentFixture<ChangeRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
