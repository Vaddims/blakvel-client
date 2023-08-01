import { IdentifiedRequest } from "../request-util.types";

export interface UpdateProductTagDto {
  readonly id: string;
  readonly name: string;
  readonly fields: ((UpdateProductTagDto.CreateProductTagFieldDto & IdentifiedRequest) | UpdateProductTagDto.CreateProductTagFieldDto)[];
}

export namespace UpdateProductTagDto {
  export interface CreateProductTagFieldDto {
    readonly name: string;
    readonly required: boolean;
    readonly example: string;
  }
}

