import { TestBed } from '@angular/core/testing';

import { PostOfflinerService } from './post-offliner.service';

describe('PostOfflinerService', () => {
  let service: PostOfflinerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostOfflinerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
