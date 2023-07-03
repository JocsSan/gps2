import { TestBed } from '@angular/core/testing';

import { IndexResolver } from './index.resolver';

describe('IndexResolver', () => {
  let service: IndexResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexResolver);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
