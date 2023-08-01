import { ProductTagFieldDto } from "../product-tag-field/product-tag-field.dto";

export interface ProductTagDto {
  readonly id: string;
  readonly name: string;
  readonly fields: ProductTagFieldDto[];
}