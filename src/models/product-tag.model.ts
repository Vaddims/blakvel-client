import { ProductTagField } from "./productTagField.model";

export interface ProductTag {
  readonly id: string;
  readonly name: string;
  readonly fieldNames: ProductTagField[];
}