export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export interface User {
  readonly id: string;
  readonly role: UserRole;
}