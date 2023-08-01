import { ProductTagDto } from "../product-tag/product-tag.dto";
import { MinUserDto } from "../user/min-user.dto";

export interface ProductDto {
  readonly id: string;
  readonly creationDate: string;
  readonly price: number;
  readonly name: string;
  readonly description: string;
  readonly discountPrice: number | null;
  readonly discountExpirationDate: string | null;
  readonly stock: number;
  readonly urn: ProductDto.Media;
  readonly state: ProductDto.State;

  readonly physicalId: string;

  readonly seller: MinUserDto | null;
  readonly tags: ProductTagDto[];
  readonly specifications: any[];
}

export namespace ProductDto {
  export enum State {
    Public = 'public',
    Prepublic = 'prepublic',
    Internal = 'internal',
    Archive = 'archive',
  } 

  export interface Media {
    thumbnail: string | null;
    thumbs: string[];
  }
}