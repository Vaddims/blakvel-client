import { Product } from './product.model';

export type UpdateProduct = Partial<Omit<Product, 'urn'>>;