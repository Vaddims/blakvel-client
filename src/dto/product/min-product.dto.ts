import { ProductDto } from "./product.dto";

export interface MinProductDto {
  readonly id: string;
  readonly creationDate: string;
  readonly price: number;
  readonly name: string;
  readonly description: string;
  readonly discountPrice: number | null;
  readonly discountExpirationDate: string | null;
  readonly stock: number;
  readonly urn: ProductDto.Media;
}