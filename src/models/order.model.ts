import { Product } from "./product.model";
import { User } from "./user.model";

export enum OrderStatus {
  Open = 'open',
  Archived = 'archived',
  Canceled = 'canceled',
}

export interface ClientOrder {
  readonly id: string;
  readonly author: User;
  readonly creationDate: string;
  readonly status: OrderStatus;
  readonly items: {
    readonly product: Product;
    readonly quantity: number;
    readonly archivedPrice: number;
  }[];
  readonly shippingAddress: {
    readonly city: string | null;
    readonly state: string | null;
    readonly line1: string | null;
    readonly line2: string | null;
    readonly postalCode: string | null;
    readonly country: string | null;
  }
}