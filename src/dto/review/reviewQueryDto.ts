export class ReviewQueryDto {
  from?: number;
  size?: number;
  dishId?: number;

  constructor(data: Partial<ReviewQueryDto>) {
    this.dishId = data.dishId;
    this.from = data.from;
    this.size = data.size;
  }
}