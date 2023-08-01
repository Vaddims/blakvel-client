import { OrderDto } from "../order/order.dto";
import { MinProductDto } from "../product/min-product.dto";

export interface UserDto {
  readonly id: string;
  readonly fullname: UserDto.Fullname;
  readonly role: UserDto.Role;
  readonly email: string;
  readonly orders: OrderDto[];
  readonly sales: MinProductDto[];
  readonly shoppingCart: UserDto.ShoppingCart;
}

export namespace UserDto {
  export namespace ShoppingCart {
    export interface Item {
      readonly product: MinProductDto;
      readonly quantity: number;
    }
  }

  export enum Role {
    Customer = 'user',
    Admin = 'admin',
  }

  export interface Fullname {
    first: string;
    last: string;
  }

  export type ShoppingCart = ShoppingCart.Item[];
}