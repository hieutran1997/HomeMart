import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMerchandiseComponent } from './detail-merchandise.component';

describe('DetailMerchandiseComponent', () => {
  let component: DetailMerchandiseComponent;
  let fixture: ComponentFixture<DetailMerchandiseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailMerchandiseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMerchandiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
