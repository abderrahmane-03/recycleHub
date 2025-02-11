import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';  // Import this
import { NotificationService } from './services/notification.service';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  notifications: any[] = [];
  unreadNotifications = 0;

  constructor(
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.preRegisterCollectors();

    // Load notifications when auth state changes
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.loadNotifications();
      } else {
        this.notifications = [];
        this.unreadNotifications = 0;
      }
    });

    // Listen for new notifications
    this.notificationService.notifications$.subscribe(() => {
      if (this.authService.isLoggedIn()) {
        this.loadNotifications();
      }
    });
  }

  private async loadNotifications() {
    const user = this.authService.getCurrentUser();
    if (user?.email) { // Use email as ID
      this.notificationService.getUserNotifications(user.email).subscribe(
        notifications => {
          this.notifications = notifications;
          this.unreadNotifications = notifications.filter(n => !n.read).length;
        }
      );
    }
  }

private preRegisterCollectors(): void {
  // Check if collectors are already registered
  const existingCollectors = JSON.parse(localStorage.getItem('collectors') || '[]');
  if (existingCollectors.length > 0) {
    return; // Skip if collectors are already registered
  }

  // Define your collectors
  const collectors = [
    {
      email: 'collector1@recyclehub.com',
      password: 'collector123',
      firstName: 'Eco',
      lastName: 'Collector',
      address: 'safi',
      phone: '+212600000001',
      birthdate: '1980-01-01',
    },
    {
      email: 'collector2@recyclehub.com',
      password: 'collector456',
      firstName: 'Green',
      lastName: 'Collector',
      address: 'safi',
      phone: '+212600000002',
      birthdate: '1985-05-05',
    },
  ];

  // Save to localStorage
  localStorage.setItem('collectors', JSON.stringify(collectors));
}
  logout() {
    this.authService.logout();
    this.notifications = [];
    this.unreadNotifications = 0;
  }
}
