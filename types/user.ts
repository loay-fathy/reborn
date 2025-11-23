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
  permissions: string; // The API returns a string role/permission set name?
  isActive: boolean;
  createdAt: string;
  role: string;
  image?: string; // Optional, might not be in API but used in UI
}

// Default initial state for a new user
export const initialUserPermissions: UserPermissions = {};

export const emptyUser: User = {
  username: "",
  fullName: "",
  permissions: "",
  isActive: true,
  createdAt: new Date().toISOString(),
  role: "",
};
