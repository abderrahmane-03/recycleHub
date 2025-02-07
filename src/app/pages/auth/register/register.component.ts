// src/app/pages/auth/register/register.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [CommonModule, ReactiveFormsModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  profilePhotoPreview: string = 'assets/default-avatar.png';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      birthdate: ['', Validators.required],
      // Use a nested FormGroup for address
      address: this.fb.group({
        city: ['', Validators.required],
        // Add additional address fields if needed, e.g.,
        // street: [''],
        // postalCode: ['']
      }),
      profilePhoto: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      // Create user object with photo data URL
      const userData = {
        ...this.registerForm.value,
        profilePhoto: this.profilePhotoPreview
      };

      this.authService.register(userData).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/login']);
          } else {
            alert("Erreur d'inscription");
          }
        },
        error: (err) => {
          console.error("Erreur d'inscription", err);
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePhotoPreview = e.target.result;
        // Update form control with data URL
        this.registerForm.patchValue({
          profilePhoto: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }
}
