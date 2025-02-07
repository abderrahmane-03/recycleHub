import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '../../../services/collection.service';
import { CollectionRequest } from '../../../models/collection-request.model';
import { CollectionRequestComponent } from '../request/request.component';

@Component({
  standalone: true,
  imports: [CollectionRequestComponent],
  template: `
    <app-collection-request
      [isEditMode]="true"
      [existingRequest]="request"
    ></app-collection-request>
  `
})
export class EditRequestComponent {
  request!: CollectionRequest;

  constructor(
    private route: ActivatedRoute,
    private collectionService: CollectionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const requestId = this.route.snapshot.paramMap.get('id');
    if (requestId) {
      this.collectionService.getRequestById(requestId).subscribe({
        next: (request) => this.request = request,
        error: () => this.router.navigate(['/'])
      });
    }
  }
}
