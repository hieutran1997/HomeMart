import { TestBed, inject } from '@angular/core/testing';

import { ServiceChatService } from './service-chat.service';

describe('ServiceChatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceChatService]
    });
  });

  it('should be created', inject([ServiceChatService], (service: ServiceChatService) => {
    expect(service).toBeTruthy();
  }));
});
