export interface ProductSnapshotDto {
  readonly snaspshotCreationDate: Date;
  readonly name: string;
  readonly price: number;
  readonly discountPrice: number | null;
}