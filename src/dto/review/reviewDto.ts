export interface ReviewDto {
  _id: string,
  rating: number;
  comment: string;
  dishId: number;
  postedAt: Date;
}