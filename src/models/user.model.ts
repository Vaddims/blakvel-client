import { ClientOrder } from "./order.model";
import { Product } from "./product.model";

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export interface User {
  readonly id: string;
  readonly fullname: {
    readonly first: string;
    readonly last: string;
  };
  readonly email: string;
  readonly role: UserRole;
  readonly shoppingCart: {
    readonly product: Product;
    readonly quantity: number;
  }[];
  readonly orders: ClientOrder[];
  readonly sales: Product[];
}

export namespace User {
  export interface Manifest {
    readonly id: string;
    readonly fullname: {
      readonly first: string;
      readonly last: string;
    }
    readonly email: string;
    readonly role: UserRole;
  }
}