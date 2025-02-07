import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  currentPoints = 0;

  constructor(private authService: AuthService) {
    const user = this.authService.getCurrentUser();
    this.currentPoints = user.points || 0;
  }
}
