import { Product } from "./product.model";

export interface CreateProductRequest extends Omit<Product.GenericInformation, 'discountExpirationDate'> {
  readonly discountExpirationDate: string | undefined;
  readonly tags: string[];
  readonly specifications: CreateProductRequest.Specification[];
  readonly seller: string | null;
}

export namespace CreateProductRequest {
  export interface Specification {
    readonly fieldId: string;
    readonly value: string;
  }
}