import { TestBed, inject } from '@angular/core/testing';

import { CopyService } from './copy.service';

describe('LibCopyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CopyService]
    });
  });

  it('should be created', inject([CopyService], (service: CopyService) => {
    expect(service).toBeTruthy();
  }));
});
