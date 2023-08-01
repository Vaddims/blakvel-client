import { UserDto } from "./user.dto";

export interface MinUserDto {
  readonly id: string;
  readonly fullname: UserDto.Fullname;
  readonly role: UserDto.Role;
}