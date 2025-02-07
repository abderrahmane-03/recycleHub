// src/app/services/collection.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
// In CollectionService and components
import { CollectionRequest } from '../models/collection-request.model';
@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private readonly storageKey = 'collectionRequests';

  // Get all requests for a user
  getUserRequests(userId: string): Observable<CollectionRequest[]> {
    const requests = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    return of(requests.filter((req: CollectionRequest) => req.userId === userId));
  }

  // Create a new request
  createRequest(request: CollectionRequest): Observable<boolean> {
    const requests = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    requests.push(request);
    localStorage.setItem(this.storageKey, JSON.stringify(requests));
    return of(true);
  }

  // Update a request
  updateRequest(requestId: string, updates: Partial<CollectionRequest>): Observable<boolean> {
    const requests = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const index = requests.findIndex((req: CollectionRequest) => req.id === requestId);
    if (index !== -1) {
      requests[index] = { ...requests[index], ...updates };
      localStorage.setItem(this.storageKey, JSON.stringify(requests));
      return of(true);
    }
    return of(false);
  }

  // Delete a request
  deleteRequest(requestId: string): Observable<boolean> {
    const requests = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const request = requests.find((req: CollectionRequest) => req.id === requestId);
    if (request?.status !== 'en attente') {
      return of(false);
    }
    const updatedRequests = requests.filter((req: CollectionRequest) => req.id !== requestId);
    localStorage.setItem(this.storageKey, JSON.stringify(updatedRequests));
    return of(true);
  }
  getActiveRequestsCount(userId: string): Observable<number> {
    const requests = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const activeRequests = requests.filter((req: CollectionRequest) =>
      req.userId === userId &&
      ['en attente', 'occupée', 'en cours'].includes(req.status)
    );
    return of(activeRequests.length);
  }

  getDailyWeight(userId: string, date: string): Observable<number> {
    const requests = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const dailyRequests = requests.filter((req: CollectionRequest) =>
      req.userId === userId &&
      req.collectionDate === date &&
      ['en attente', 'occupée', 'en cours'].includes(req.status)
    );
    return of(dailyRequests.reduce((sum: number, req: CollectionRequest) => sum + req.estimatedWeight, 0));
  }

  getRequestById(requestId: string): Observable<CollectionRequest> {
    const requests = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    const request = requests.find((req: CollectionRequest) => req.id === requestId);
    if (!request) throw new Error('Request not found');
    return of(request);
  }
  // collection.service.ts
getRequestsByCity(city: string): Observable<CollectionRequest[]> {
  const requests = JSON.parse(localStorage.getItem('collectionRequests') || '[]');
  return of(requests.filter((req: CollectionRequest) =>
    req.collectionAddress.toLowerCase().includes(city.toLowerCase()) &&
    req.status !== 'validée' &&
    req.status !== 'rejetée'
  ));
}

validateRequest(requestId: string, realWeight: number, photos: string[]): Observable<boolean> {
  const requests = JSON.parse(localStorage.getItem('collectionRequests') || '[]');
  const index = requests.findIndex((r: CollectionRequest) => r.id === requestId);

  if (index !== -1) {
    requests[index].realWeight = realWeight;
    requests[index].validationPhotos = photos;
    localStorage.setItem('collectionRequests', JSON.stringify(requests));
    return of(true);
  }
  return of(false);
}

// auth.service.ts
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

updateUserRedemptions(redemptions: any[]): void {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  user.redemptions = redemptions;
  localStorage.setItem('user', JSON.stringify(user));

  const index = users.findIndex((u: any) => u.email === user.email);
  if (index !== -1) {
    users[index] = user;
    localStorage.setItem('users', JSON.stringify(users));
  }
}
}
