import { Product } from "./product.model";

export type CreateProductTag = Omit<Product.Tag, 'id' | 'value'>;