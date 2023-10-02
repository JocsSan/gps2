import { TestBed } from '@angular/core/testing';

import { NetworkService } from './net-work.service';

describe('NetWorkService', () => {
  let service: NetworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
