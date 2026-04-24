import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:4000/api/auth/login';
  private logoutUrl = 'http://localhost:4000/api/logout';

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, credentials);
  }

  logout(): Observable<void> {
    const token = this.getToken();
    localStorage.removeItem('token');
    return this.http.post<void>(
      this.logoutUrl,
      {},
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
