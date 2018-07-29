import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbdCarouselConfigComponent } from './ngbd-carousel-config.component';

describe('NgbdCarouselConfigComponent', () => {
  let component: NgbdCarouselConfigComponent;
  let fixture: ComponentFixture<NgbdCarouselConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgbdCarouselConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgbdCarouselConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
