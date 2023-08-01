import { ProductDto } from "./product.dto";

export interface CreateProductDto {
  readonly price: number;
  readonly name: string;
  readonly description: string;
  readonly discountPrice: number | null;
  readonly discountExpirationDate?: string | undefined;
  readonly stock: number;

  readonly state: ProductDto.State;
  readonly physicalId: string;

  readonly seller: string | null;
  readonly tags: string[];
  readonly specifications: CreateProductDto.CreateProductSpecificationDto[];
}

export namespace CreateProductDto {
  export interface CreateProductSpecificationDto {
    readonly fieldId: string;
    readonly value: string;
  }
}