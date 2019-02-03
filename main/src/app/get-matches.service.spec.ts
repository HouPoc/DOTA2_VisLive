import { TestBed } from '@angular/core/testing';

import { GetMatchesService } from './get-matches.service';

describe('GetMatchesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetMatchesService = TestBed.get(GetMatchesService);
    expect(service).toBeTruthy();
  });
});
