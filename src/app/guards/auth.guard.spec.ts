import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';

describe('AuthGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj<AuthService>('AuthService', ['isLoggedIn', 'getUserRole']);
    mockRouter = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should return true if logged in and role matches', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    mockAuthService.getUserRole.and.returnValue('Admin');

    const route: any = { data: { roles: ['Admin'] } };
    const state: any = {};

    const result = TestBed.runInInjectionContext(() => AuthGuard(route, state));
    expect(result).toBeTrue();
  });

  it('should redirect to login and return false if not logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);

    const route: any = { data: { roles: ['Admin'] } };
    const state: any = {};

    const result = TestBed.runInInjectionContext(() => AuthGuard(route, state));
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    expect(result).toBeFalse();
  });
});
