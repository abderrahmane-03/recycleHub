// points.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-points',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './convertpoints.component.html',
  styleUrls: ['./convertpoints.component.css']
})
export class PointsComponent {
  currentPoints = 0;
  redemptionOptions = [
    { points: 100, reward: '50 DH' },
    { points: 200, reward: '120 DH' },
    { points: 500, reward: '350 DH' }
  ];
  redemptionHistory: any[] = [];

  constructor(private authService: AuthService) {
    const user = this.authService.getCurrentUser();
    this.currentPoints = user.points || 0;
    this.redemptionHistory = user.redemptions || [];
  }

  redeemPoints(option: any): void {
    if (this.currentPoints >= option.points) {
      this.currentPoints -= option.points;
      const transaction = {
        date: new Date(),
        points: option.points,
        reward: option.reward
      };

      this.redemptionHistory = [...this.redemptionHistory, transaction];
      this.authService.updateUserRedemptions(this.redemptionHistory);

      alert(`Conversion réussie : ${option.reward}`);
    }
  }
}
