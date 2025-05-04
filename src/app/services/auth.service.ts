import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isLoggedIn(): boolean {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    setLoginState(state: boolean): void {
        localStorage.setItem('isLoggedIn', String(state));
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    logout(): void {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('token');
    }
}
