import { Component } from '@angular/core';
import { CollectionService } from '../../../services/collection.service';
import { AuthService } from '../../../services/auth.service';
import { CollectionRequest } from '../../../models/collection-request.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-collector-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './collector.component.html'
})
export class CollectorDashboardComponent {
  expandedRequest: string | null = null;
  filteredRequests: CollectionRequest[] = [];
  statusClasses = {
    'en attente': 'bg-yellow-100 text-yellow-800',
    'occupée': 'bg-blue-100 text-blue-800',
    'en cours': 'bg-orange-100 text-orange-800',
    'validée': 'bg-green-100 text-green-800',
    'rejetée': 'bg-red-100 text-red-800'
  };

  constructor(
    private collectionService: CollectionService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const collector = this.authService.getCurrentUser();
    this.collectionService.getRequestsByCity(collector.address.city)
      .subscribe(requests => {
        this.filteredRequests = requests.filter(r => r.status !== 'validée' && r.status !== 'rejetée');
      });
  }

  updateStatus(requestId: string, newStatus: string) {
    this.collectionService.updateRequest(requestId, { status: newStatus })
    .subscribe(updated => {
      if (updated) {
        const request = this.filteredRequests.find(r => r.id === requestId);
        if (request) request.status = newStatus;
      }
    });

  }
  toggleDetails(requestId: string): void {
    this.expandedRequest = this.expandedRequest === requestId ? null : requestId;
  }

  validateRequest(request: CollectionRequest) {
    if (!request.realWeight || request.realWeight < 1000) {
      alert('Poids réel doit être au moins 1000g');
      return;
    }

    this.collectionService.validateRequest(request.id, request.realWeight, request.validationPhotos || [])

      .subscribe(success => {
        if (success) {
          this.updateStatus(request.id, 'validée');
          this.calculatePoints(request);
        }
      });
  }

  private calculatePoints(request: CollectionRequest) {
    const pointsMap: Record<string, number> = {
      'plastique': 2,
      'verre': 1,
      'papier': 1,
      'métal': 5
    };


    const points = request.wasteTypes.reduce((sum, type) =>
      sum + (pointsMap[type] * request.realWeight! / 1000), 0);

    this.authService.addUserPoints(request.userId, Math.round(points));
  }

  onValidationPhotos(event: any, request: CollectionRequest) {
    const files = event.target.files;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      request.validationPhotos = request.validationPhotos || [];
      request.validationPhotos.push(e.target.result);
    };
    reader.readAsDataURL(files[0]);
  }
}
