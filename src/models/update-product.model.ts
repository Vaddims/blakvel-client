import { Product } from './product.model';

export type UpdateProduct = Partial<Omit<Product, 'urn'>> & {
  readonly addTags?: string[];
  readonly removeTags?: string[];
};