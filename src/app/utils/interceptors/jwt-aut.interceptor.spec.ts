import { TestBed } from '@angular/core/testing';

import { JwtAutInterceptor } from './jwt-aut.interceptor';

describe('JwtAutInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      JwtAutInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: JwtAutInterceptor = TestBed.inject(JwtAutInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
