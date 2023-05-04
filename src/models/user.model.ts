import { Product } from "./product.model";

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export interface User {
  readonly id: string;
  readonly email: string;
  readonly role: UserRole;
  readonly shoppingCart: {
    readonly product: Product;
    readonly quantity: number;
  }[];
}