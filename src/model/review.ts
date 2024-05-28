import {Schema, model, Document} from 'mongoose';

export interface IReview extends Document {
  rating: number;
  comment: string;
  dishId: number;
  postedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  rating: {
    type: Number,
    required: true,
  },

  comment: {
    type: String,
    required: true,
  },

  dishId: {
    type: Number,
    required: true,
  },

  postedAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = model<IReview>('Review', reviewSchema);

export default Review;
