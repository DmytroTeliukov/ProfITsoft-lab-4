export class ReviewSaveDto {
  rating?: number;
  comment?: string;
  dishId?: number;

  constructor(data: Partial<ReviewSaveDto>) {
    this.dishId = data.dishId;
    this.rating = data.rating;
    this.comment = data.comment;
  }
}