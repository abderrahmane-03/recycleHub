// collection-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../../../../services/collection.service';
import { AuthService } from '../../../../services/auth.service';
import { CollectionRequest } from '../../../../models/collection-request.model';
import{ CommonModule } from '@angular/common';
import{ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-collection-list',
  templateUrl: './collecte-list.component.html',
})
export class CollectionListComponent implements OnInit {
  requests: CollectionRequest[] = [];
  expandedRequest: string | null = null;
  remainingCapacity: number | null = null;

  constructor(
    private collectionService: CollectionService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadRequests();
    this.calculateRemainingCapacity();
  }

  async loadRequests(): Promise<void> {
    const userId = this.authService.getCurrentUser().email;
    this.collectionService.getUserRequests(userId).subscribe(requests => {
      this.requests = requests;
    });
  }

  toggleDetails(requestId: string): void {
    this.expandedRequest = this.expandedRequest === requestId ? null : requestId;
  }

  canEdit(request: CollectionRequest): boolean {
    return request.status === 'en attente';
  }

  editRequest(request: CollectionRequest): void {
    this.router.navigate(['/edit-request', request.id]);
  }

  async calculateRemainingCapacity(): Promise<void> {
    const user = this.authService.getCurrentUser();
    const today = new Date().toISOString().split('T')[0];

    this.collectionService.getDailyWeight(user.email, today).subscribe(weight => {
      this.remainingCapacity = Math.max(10000 - weight, 0);
    });
  }

  deleteRequest(requestId: string): void {
    this.collectionService.deleteRequest(requestId).subscribe(success => {
      if (success) {
        this.loadRequests();
        this.calculateRemainingCapacity();
      }
    });
  }
}
