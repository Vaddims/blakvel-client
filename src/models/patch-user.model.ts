import { UserRole } from "./user.model";

export interface PatchUser {
  readonly userId: string;
  readonly role?: UserRole;
  readonly shoppingCart?: {
    readonly productId: string;
    readonly quantity: number;
  }[];
}