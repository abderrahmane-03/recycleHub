import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profileForm: FormGroup;
  users: any[] = [];  // Array of users from localStorage
  loggedUser: any = null;
  userIndex: number = -1;  // Store the index of the logged-in user

  constructor(private fb: FormBuilder) {
    // Retrieve users from localStorage
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }

    // Get the logged-in user (you might need a better way to identify them)
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      this.loggedUser = JSON.parse(currentUser);

      // Find user index in the array
      this.userIndex = this.users.findIndex(user => user.email === this.loggedUser.email);
    }

    // Initialize form with user data
    this.profileForm = this.fb.group({
      firstName: [this.loggedUser?.firstName || '', Validators.required],
      lastName: [this.loggedUser?.lastName || '', Validators.required],
      email: [{ value: this.loggedUser?.email || '', disabled: true }], // Email should not be editable
      phone: [this.loggedUser?.phone || '', Validators.required],
      password: [this.loggedUser?.password || '', Validators.required],
      birthdate: [this.loggedUser?.birthdate || '', Validators.required],
      address: [this.loggedUser?.address || '', Validators.required],
      profilePhoto: [this.loggedUser?.profilePhoto || '']
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileForm.patchValue({
          profilePhoto: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    if (this.profileForm.valid && this.userIndex !== -1) {
      const updatedUser = this.profileForm.getRawValue(); // Get form data
      updatedUser.email = this.loggedUser.email; // Ensure email stays the same

      // Update user in array
      this.users[this.userIndex] = updatedUser;

      // Save back to localStorage
      localStorage.setItem("users", JSON.stringify(this.users));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      this.loggedUser = updatedUser; // Update UI
      alert("Profil mis à jour avec succès !");
    }
  }

  deleteAccount() {
    if (confirm("Voulez-vous vraiment supprimer votre compte ?")) {
      if (this.userIndex !== -1) {
        this.users.splice(this.userIndex, 1); // Remove user from array
        localStorage.setItem("users", JSON.stringify(this.users));
      }
      localStorage.removeItem("user");
      alert("Compte supprimé !");
      location.reload();
    }
  }
}
