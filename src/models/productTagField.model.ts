export interface ProductTagField<T extends string | number | boolean = any> { 
  readonly id: string;
  readonly name: string;
  readonly required: boolean;
  readonly example: string;
  readonly value: T;
}