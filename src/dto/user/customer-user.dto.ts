import { MinProductDto } from "../product/min-product.dto";
import { UserDto } from "./user.dto";

export interface CustomerUserDto {
  readonly id: string;
  readonly fullname: UserDto.Fullname;
  readonly role: UserDto.Role;
  readonly sales: MinProductDto[];
}