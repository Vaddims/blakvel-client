import { IdentifiedRequest } from "../request-util.types";
import { UpdateProductTagDto } from "./update-product-tag.dto";

export interface CreateProductTagDto {
  readonly name: string;
  readonly fields: ((UpdateProductTagDto.CreateProductTagFieldDto & IdentifiedRequest) | UpdateProductTagDto.CreateProductTagFieldDto)[];
}