export interface ProductTagField<T = string | number | boolean> { 
  readonly id: string;
  readonly name: string;
  readonly required: boolean;
  readonly example: string;
  readonly value: T;
}