import { TestBed, inject } from '@angular/core/testing';

import { ViewCartService } from './view-cart.service';

describe('ViewCartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewCartService]
    });
  });

  it('should be created', inject([ViewCartService], (service: ViewCartService) => {
    expect(service).toBeTruthy();
  }));
});
