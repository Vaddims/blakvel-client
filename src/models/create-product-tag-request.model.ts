import { Product } from "./product.model";

export interface CreateProductTagRequest extends Omit<Product.Unregistered.Tag, 'fields'> {
  readonly fields: Product.Unregistered.Tag.Field[];
}