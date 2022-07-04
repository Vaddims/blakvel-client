import { Product } from "./product.model";

export type CreateProduct = Partial<Omit<Product, 'id' | 'urn'>>;
