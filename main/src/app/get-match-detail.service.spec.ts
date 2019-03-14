import { TestBed } from '@angular/core/testing';

import { GetMatchDetailService } from './get-match-detail.service';

describe('GetMatchDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetMatchDetailService = TestBed.get(GetMatchDetailService);
    expect(service).toBeTruthy();
  });
});
