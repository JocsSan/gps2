import { TestBed } from '@angular/core/testing';

import { NetWorkService } from './net-work.service';

describe('NetWorkService', () => {
  let service: NetWorkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetWorkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
