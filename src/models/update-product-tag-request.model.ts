import { Product } from "./product.model";

export interface UpdateProductTagRequest extends Omit<Product.Tag, 'fields'> {
  readonly fields: (Product.Tag.Field | Product.Unregistered.Tag.Field)[];
}