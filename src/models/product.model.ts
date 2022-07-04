export interface Product {
  readonly id: string;
  readonly name: string;
  readonly tags: string[];
  readonly price: number;
  readonly originalPrice: number | null;
  readonly stock: number;
  readonly urn: {
    readonly thumbs: string[];
    readonly thumbnail: string | null;
  }
}