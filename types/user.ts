// types/user.ts

// Define the specific permissions toggles shown in the image
export interface UserPermissions {
  [key: string]: boolean;
}

export interface Permission {
  name: string;
  value: number;
}

// The main User interface
export interface User {
  id?: number; // Optional for new users before saving to DB
  username: string;
  fullName: string;
  password?: string;
  isActive: boolean;
  createdAt: string;
  role: string;
  imageUrl?: string; // Changed from 'image' to 'imageUrl'
  permissions: number; // Add this!
}

// Default initial state for a new user
export const initialUserPermissions: UserPermissions = {};

export const emptyUser: User = {
  username: "",
  fullName: "",
  permissions: 0,
  isActive: true,
  createdAt: new Date().toISOString(),
  role: "",
};
