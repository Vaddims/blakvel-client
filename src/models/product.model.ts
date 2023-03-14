import { ProductTag } from "./product-tag.model";

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly tags: ProductTag[];
  readonly price: number;
  readonly originalPrice: number | null;
  readonly stock: number;
  readonly urn: {
    readonly thumbs: string[];
    readonly thumbnail: string | null;
  }
}