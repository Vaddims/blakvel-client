import { Product } from "./product.model";

export interface CreateProductRequest extends Product.GenericInformation {
  readonly tags: string[];
  readonly specifications: CreateProductRequest.Specification[];
}

export namespace CreateProductRequest {
  export interface Specification {
    readonly fieldId: string;
    readonly value: string;
  }
}