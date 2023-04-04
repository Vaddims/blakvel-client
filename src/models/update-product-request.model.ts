import { Product } from './product.model';

export interface UpdateProductRequest extends Partial<Omit<Product.GenericInformation, 'discountExpirationDate'>> {
  readonly discountExpirationDate?: string;
  readonly tags?: string[];
  readonly specifications?: UpdateProductRequest.Specification[];
}

export namespace UpdateProductRequest {
  export interface Specification {
    readonly fieldId: string;
    readonly value: string;
  }
}