import {TestBed} from '@angular/core/testing';

import {IgListService} from './library-list.service';

describe('IgListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IgListService = TestBed.get(IgListService);
    expect(service).toBeTruthy();
  });
});
