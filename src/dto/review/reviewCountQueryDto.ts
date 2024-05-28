export class ReviewCountQueryDto {
  dishIds?: number[];

  constructor(data: Partial<ReviewCountQueryDto>) {
    this.dishIds = data.dishIds;
  }
}