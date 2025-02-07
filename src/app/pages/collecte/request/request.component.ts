import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CollectionService } from '../../../services/collection.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CollectionRequest } from '../../../models/collection-request.model';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-collection-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './request.component.html',
})
export class CollectionRequestComponent implements OnInit {
  @Input() isEditMode = false; // Input to determine if in edit mode
  @Input() existingRequest?: CollectionRequest; // Input for existing request data

  requestForm: FormGroup; // Form group for the request
  wasteTypes = ['plastique', 'verre', 'papier', 'métal']; // Available waste types
  timeSlots = this.generateTimeSlots(); // Time slots for collection
  selectedWasteTypes: string[] = []; // Selected waste types
  photos: string[] = []; // Array for base64-encoded photos
  validationMessage = ''; // Validation message for errors
  remainingCapacity = 10000; // Remaining daily capacity in grams

  constructor(
    private fb: FormBuilder,
    private collectionService: CollectionService,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the form
    this.requestForm = this.fb.group({
      wasteTypes: [[], Validators.required],
      estimatedWeight: [null, [Validators.required, Validators.min(1000)]],
      collectionAddress: ['', Validators.required],
      collectionDate: ['', Validators.required],
      collectionTime: ['', Validators.required],
      notes: [''],
    });
  }

  ngOnInit(): void {
    // If in edit mode, initialize form with existing data
    if (this.isEditMode && this.existingRequest) {
      this.initializeFormWithExistingData();
    }

    // Calculate remaining capacity for new requests
    if (!this.isEditMode) {
      this.calculateRemainingCapacity();
    }
  }

  // Initialize form with existing request data
  private initializeFormWithExistingData(): void {
    this.requestForm.patchValue(this.existingRequest!);
    this.selectedWasteTypes = this.existingRequest!.wasteTypes;
    this.photos = this.existingRequest!.photos || [];
  }

  // Calculate remaining daily capacity
  private async calculateRemainingCapacity(): Promise<void> {
    const user = this.authService.getCurrentUser();
    const today = new Date().toISOString().split('T')[0]; // Get today's date
    const dailyWeight = await lastValueFrom(
      this.collectionService.getDailyWeight(user.email, today)
    );
    this.remainingCapacity = Math.max(10000 - dailyWeight, 0); // 10kg limit
  }

  // Handle waste type selection
  onWasteTypeChange(event: any): void {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedWasteTypes.push(value);
    } else {
      this.selectedWasteTypes = this.selectedWasteTypes.filter(
        (type) => type !== value
      );
    }
    this.requestForm.patchValue({ wasteTypes: this.selectedWasteTypes });
  }

  // Handle file selection for photos
  onFileSelected(event: any): void {
    const files = event.target.files;
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.photos.push(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  // Handle form submission
  async onSubmit(): Promise<void> {
    this.validationMessage = '';

    if (this.requestForm.valid) {
      const user = this.authService.getCurrentUser();
      const collectionDate = this.requestForm.value.collectionDate;
      const estimatedWeight = this.requestForm.value.estimatedWeight;

      // Validate active requests and daily weight limit for new requests
      if (!this.isEditMode) {
        const activeCount = await lastValueFrom(
          this.collectionService.getActiveRequestsCount(user.email)
        );
        if (activeCount >= 3) {
          this.validationMessage =
            'Vous ne pouvez pas avoir plus de 3 demandes actives';
          return;
        }

        if (estimatedWeight > this.remainingCapacity) {
          this.validationMessage = `Limite quotidienne de 10kg atteinte. Vous pouvez encore collecter ${this.remainingCapacity / 1000} kg aujourd'hui.`;
          return;
        }
      }

      // Prepare request data
      const requestData = {
        id: this.isEditMode ? this.existingRequest!.id : this.generateId(),
        userId: user.email,
        ...this.requestForm.value,
        photos: this.photos,
        status: this.isEditMode ? this.existingRequest!.status : 'en attente',
      };

      // Save or update the request
      if (this.isEditMode) {
        this.collectionService
          .updateRequest(requestData.id, requestData)
          .subscribe((success) => {
            if (success) this.router.navigate(['']);
          });
      } else {
        this.collectionService.createRequest(requestData).subscribe((success) => {
          if (success) this.router.navigate(['']);
        });
      }
    }
  }

  // Generate a unique ID for new requests
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // Generate time slots from 09:00 to 18:00
  private generateTimeSlots(): string[] {
    const slots = [];
    for (let hour = 9; hour <= 18; hour++) {
      slots.push(`${hour}:00 - ${hour + 1}:00`);
    }
    return slots;
  }
}
