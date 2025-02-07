// src/app/models/user.model.ts
export interface User {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  birthdate: string;
  address: {
    city: string;
    // add other address properties as needed, e.g., street, zip, etc.
  };
  profilePhoto?: string;
  points?: number;
  redemptions?: any[];
}
