import { Product } from './product.model';

export interface UpdateProductRequest extends Partial<Product.GenericInformation> {
  readonly tags?: string[];
  readonly specifications?: UpdateProductRequest.Specification[];
}

export namespace UpdateProductRequest {
  export interface Specification {
    readonly fieldId: string;
    readonly value: string;
  }
}