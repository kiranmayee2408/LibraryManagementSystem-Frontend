import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterOutlet, RouterModule, Router } from '@angular/router';

import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterOutlet,
    RouterModule,
    LoginComponent
  ]
})
export class AppComponent implements OnInit {
  username: string | null = null;
  role: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.role = this.authService.getUserRole();
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.role === 'Admin';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}