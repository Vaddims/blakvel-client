import { MinProductDto } from "../product/min-product.dto";
import { MinUserDto } from "../user/min-user.dto";

export interface OrderDto {
  readonly id: string;
  readonly author: MinUserDto;
  readonly creationDate: string;
  readonly status: OrderDto.Status;
  readonly items: OrderDto.ItemDto[];
  readonly shippingAddress: OrderDto.Address;
}

export namespace OrderDto {
  export interface ItemDto {
    readonly product: MinProductDto; // Product snapshot
    readonly quantity: number;
    readonly archivedPrice: number;
  }

  export enum Status {
    Open = 'open',
    Archived = 'archived',
    canceled = 'canceled',
  }

  export interface Address {
    readonly city: string | null;
    readonly state: string | null;
    readonly line1: string | null;
    readonly line2: string | null;
    readonly postalCode: string | null;
    readonly country: string | null;
  }
}