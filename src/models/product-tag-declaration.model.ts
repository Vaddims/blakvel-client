import { ProductTagFieldDeclaration } from "./product-tag-field-declaration.model";

export interface ProductTagDeclaration {
  readonly name: string;
  readonly fields: ProductTagFieldDeclaration[];
}