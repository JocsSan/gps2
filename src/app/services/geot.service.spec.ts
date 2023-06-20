import { TestBed } from '@angular/core/testing';

import { GeotService } from './geot.service';

describe('GeotService', () => {
  let service: GeotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
