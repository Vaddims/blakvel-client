import { ProductDto } from "./product.dto";

export interface UpdateProductDto {
  readonly creationDate?: string;
  readonly physicalId?: string;
  readonly state?: ProductDto.State;
  readonly name?: string;
  readonly price?: number;
  readonly discountPrice?: number | null;
  readonly discountExpirationDate?: string | null;
  readonly stock?: number;
  readonly description?: string;
  readonly tags?: string[];
  readonly seller?: string | null;
  readonly specifications?: UpdateProductDto.UpdateProductSpecificationDto[];
}

export namespace UpdateProductDto {
  export interface UpdateProductSpecificationDto {
    readonly fieldId: string;
    readonly value: string;
  }
}