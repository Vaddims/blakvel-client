import { Product } from './product.model';

export interface UpdateProductRequest extends Partial<Omit<Product.GenericInformation, 'discountExpirationDate'>> {
  readonly discountExpirationDate?: string | null;
  readonly tags?: string[];
  readonly specifications?: UpdateProductRequest.Specification[];
  readonly seller?: string | null;
}

export namespace UpdateProductRequest {
  export interface Specification {
    readonly fieldId: string;
    readonly value: string;
  }
}