import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaviorSubject to track login status
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private router: Router) {}

  // Check if a token exists in local storage
  private hasToken(): boolean {
    return !!localStorage.getItem('user');
  }

  // Register a new user
  register(user: any): Observable<boolean> {
    // Simulate registration by saving user data to local storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
// In AuthService register method
    if (user.profilePhoto) {
      const reader = new FileReader();
      reader.readAsDataURL(user.profilePhoto);
      reader.onload = () => {
        user.profilePhoto = reader.result as string;
      };
    }

    return of(true); // Simulate successful registration
  }

  // Login with email and password
  login(email: string, password: string): Observable<boolean> {
    // Simulate login by checking local storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (user) {
      // Save user data to local storage
      localStorage.setItem('user', JSON.stringify(user));
      this.isLoggedInSubject.next(true); // Update login status
      return of(true); // Simulate successful login
    } else {
      return of(false); // Simulate failed login
    }
  }

  // Logout the user
  logout(): void {
    localStorage.removeItem('user'); // Remove user data from local storage
    this.isLoggedInSubject.next(false); // Update login status
    this.router.navigate(['/login']); // Redirect to login page
  }

  // Get the current user
  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return this.hasToken();
  }
}
