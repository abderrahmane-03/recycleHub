// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentPoints = 0;
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('user');
  }

  register(user: any): Observable<boolean> {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
    this.router.navigate(['/login']);
    return of(true);
  }

  login(email: string, password: string): Observable<boolean> {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const collectors = JSON.parse(localStorage.getItem('collectors') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    const collector = collectors.find((u: any) => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.isLoggedInSubject.next(true);
      return of(true);
    }
    if (collector) {
      localStorage.setItem('user', JSON.stringify(collector));
      this.isLoggedInSubject.next(true);
      return of(true);
    } else {
      return of(false);
    }
  }

  logout(): void {
    localStorage.removeItem('user');
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  isCollector(): boolean {
    const user = this.getCurrentUser();
    if (!user?.email) return false;

    const collectors = JSON.parse(localStorage.getItem('collectors') || '[]');
    return collectors.some((c: any) => c.email === user.email);
  }

  getCurrentUser() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.email ? user : null; // Ensure email exists
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  // NEW: Add user points
  addUserPoints(userId: string, points: number): void {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === userId);
    if (user) {
      user.points = (user.points || 0) + points;
      localStorage.setItem('users', JSON.stringify(users));
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.email === userId) {
        currentUser.points = user.points;
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
    }
  }

  // NEW: Update user redemptions
  updateUserRedemptions(redemptions: any[]): void {
    const user = this.getCurrentUser();
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    user.redemptions = redemptions;
    user.points = this.currentPoints;

    localStorage.setItem('user', JSON.stringify(user));

    const index = users.findIndex((u: any) => u.email === user.email);
    if (index !== -1) {
      users[index] = user;
      localStorage.setItem('users', JSON.stringify(users));
    }
  }
}
