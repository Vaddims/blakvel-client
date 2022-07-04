export enum UserRole {
  Admin = 'admin',
}

export interface User {
  publicId: string;
  role: UserRole;
}