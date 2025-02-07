import { Component } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators } from '@angular/forms';
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
      address: ['', Validators.required],
      profilePhoto: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
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
      this.registerForm.patchValue({
        profilePhoto: file
      });
    }
  }
  // saveProfile() {
  //   if (this.profileForm.valid && this.userIndex !== -1) {
  //     const updatedUser = this.profileForm.getRawValue(); // Get form data
  //     updatedUser.email = this.loggedUser.email; // Ensure email stays the same

  //     // Update user in array
  //     this.users[this.userIndex] = updatedUser;

  //     // Save back to localStorage
  //     localStorage.setItem("users", JSON.stringify(this.users));
  //     localStorage.setItem("user", JSON.stringify(updatedUser));

  //     this.loggedUser = updatedUser; // Update UI
  //     alert("Profil mis à jour avec succès !");
  //   }
  // }

}
