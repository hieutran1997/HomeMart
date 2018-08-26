import { TestBed, inject } from '@angular/core/testing';

import { LoginsuccesService } from './loginsucces.service';

describe('LoginsuccesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginsuccesService]
    });
  });

  it('should be created', inject([LoginsuccesService], (service: LoginsuccesService) => {
    expect(service).toBeTruthy();
  }));
});
