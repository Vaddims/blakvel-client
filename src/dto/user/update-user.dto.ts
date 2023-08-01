import { UserDto } from "./user.dto";

export interface UpdateUser {
  readonly userId: string;
  readonly role?: UserDto.Role;
  readonly shoppingCart?: {
    readonly productId: string;
    readonly quantity: number;
  }[];
}