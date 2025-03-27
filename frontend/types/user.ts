export type UserRole = 'admin' | 'hr' | 'employee';

export interface User {
  id: string;
  userName: string;
  email: string;
  position: string;
  role: UserRole;
  photoUrl?: string;
}

export interface ProfileUpdateData {
  userName: string;
  position: string;
  photoUrl?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RegisterData {
  userName: string;
  email: string;
  password: string;
  position: string;
  role?: UserRole;
} 