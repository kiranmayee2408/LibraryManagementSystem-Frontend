import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthService]
        });
        service = TestBed.inject(AuthService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return the correct role from token', () => {
        // payload: { "role": "Admin" }
        const fakeToken =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
            'eyJyb2xlIjoiQWRtaW4ifQ.' +
            'fakesignature';

        spyOn(localStorage, 'getItem').and.returnValue(fakeToken);

        const role = service.getUserRole();
        expect(role).toBe('Admin');
    });
});
