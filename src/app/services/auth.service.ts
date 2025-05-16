import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;

    constructor(private http: HttpClient) { }

    login(username: string, password: string): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { username, password }).pipe(
            tap((response) => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('isLoggedIn', 'true');

                console.log('🔐 JWT Saved to localStorage');
            })
        );
    }

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
        localStorage.removeItem('token');
    }

    getUserRole(): string | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const role = payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
            console.log('🧠 Decoded role:', role);
            return role || null;
        } catch {
            return null;
        }
    }

    getUsername(): string | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const name =
                payload['username'] ||
                payload['name'] ||
                payload['sub'] ||
                payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
            console.log('🧠 Decoded username:', name);
            return name || null;
        } catch {
            return null;
        }
    }
}