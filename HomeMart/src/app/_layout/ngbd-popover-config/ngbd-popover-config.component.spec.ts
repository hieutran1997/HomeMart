import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbdPopoverConfig } from './ngbd-popover-config.component';

describe('NgbdPopoverConfig', () => {
  let component: NgbdPopoverConfig;
  let fixture: ComponentFixture<NgbdPopoverConfig>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgbdPopoverConfig ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgbdPopoverConfig);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
