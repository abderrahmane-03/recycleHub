import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';  // Import this

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
export class AppComponent {
  constructor(public authService: AuthService) {}

  title = 'recyclHub';
  logout() {
    this.authService.logout();
  }
}
