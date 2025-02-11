import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CollectionRequest } from '../../../../models/collection-request.model';
import { AuthService } from '../../../../services/auth.service';
import { CollectionService } from '../../../../services/collection.service';
import { selectUserRequests } from '../../../../state/collection.selectors';
import { deleteRequest, loadRequests } from '../../../../state/collection.actions';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-collection-list',
  templateUrl: './collecte-list.component.html',
})
export class CollectionListComponent implements OnInit {
  // Use the definite assignment operator to tell TS that this property will be assigned later.
  requests$!: Observable<CollectionRequest[]>;
  requests: CollectionRequest[] = [];
  expandedRequest: string | null = null;
  remainingCapacity: number | null = null;
  userId!: string;

  constructor(
    private store: Store,
    private router: Router,
    private authService: AuthService,
    private collectionService: CollectionService
  ) {}

  async ngOnInit(): Promise<void> {
    const user = this.authService.getCurrentUser();
    this.userId = user.email;
    this.requests$ = this.store.select(selectUserRequests(this.userId));

    await this.loadRequests();
    this.store.dispatch(loadRequests());
    this.calculateRemainingCapacity();
  }

  private async loadRequests(): Promise<void> {
    this.collectionService.getUserRequests(this.userId).subscribe(requests => {
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

  private calculateRemainingCapacity(): void {
    const today = new Date().toISOString().split('T')[0];
    this.collectionService.getDailyWeight(this.userId, today).subscribe(weight => {
      this.remainingCapacity = Math.max(10000 - weight, 0);
    });
  }

  deleteRequest(requestId: string): void {
    this.store.dispatch(deleteRequest({ requestId }));
    this.loadRequests();
    this.calculateRemainingCapacity();
  }
}
