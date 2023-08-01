import { CustomerProductTagDto } from "../product-tag/customer-product-tag.dto";
import { MinUserDto } from "../user/min-user.dto";
import { ProductDto } from "./product.dto";

export interface CustomerProductDto {
  readonly id: string;
  readonly creationDate: string;
  readonly price: number;
  readonly name: string;
  readonly description: string;
  readonly discountPrice: number | null;
  readonly discountExpirationDate: string | null;
  readonly stock: number;
  readonly urn: ProductDto.Media;

  readonly seller: MinUserDto;
  readonly tags: CustomerProductTagDto[];

  readonly specifications: any[]; //customer version
}