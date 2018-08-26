import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCustomComponent } from './info-custom.component';

describe('InfoCustomComponent', () => {
  let component: InfoCustomComponent;
  let fixture: ComponentFixture<InfoCustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoCustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
