import { ProductTag } from "./product-tag.model";

export type CreateProductTag = Omit<ProductTag, 'id' | 'value'>;