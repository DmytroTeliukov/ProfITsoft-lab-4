import Review, {IReview} from '../../model/review';
import {ReviewSaveDto} from "../../dto/review/reviewSaveDto";
import {ReviewCountQueryDto} from "../../dto/review/reviewCountQueryDto";
import {ReviewDto} from "../../dto/review/reviewDto";
import {checkDishExistsById as checkDishExists} from "../../client/dishes";
import {ReviewCountInfoDto} from "../../dto/review/reviewCountInfoDto";
import {DishNotFoundError} from "../../system/dishNotFoundError";

export const createReview = async ({
  rating,
  comment,
  dishId,
}: ReviewSaveDto): Promise<string> => {
  if (!dishId) {
    throw new Error('Dish ID is required');
  }

  const dishExists = await checkDishExists(dishId); // external service

  if (!dishExists) {
    throw new DishNotFoundError("Dish not found!");
  }

  const review = await new Review({
    rating: rating,
    comment: comment,
    dishId: dishId,
  }).save();

  return review._id;
};

export const getReviewsByDishId = async (dishId: number, size: number, from: number): Promise<ReviewDto[]> => {
  const reviews = await Review.find({ dishId })
    .sort({ postedAt: -1 })
    .skip(from)
    .limit(size);

  return reviews.map(review => toReviewDto(review));
};

export const getCountsByDishIds = async ({
  dishIds,
}: ReviewCountQueryDto): Promise<ReviewCountInfoDto> => {
  // Check if dishIds is undefined or empty
  if (!dishIds || dishIds.length === 0) {
    return {};
  }

  const counts = await Review.aggregate([
    {
      $match: {
        dishId: {
          $in: dishIds.map(id => id),
        },
      },
    },
    { $group: { _id: '$dishId', count: { $sum: 1 } } },
  ]);

  const result: ReviewCountInfoDto = {};
  counts.forEach((count: { _id: string, count: number }) => {
    result[count._id.toString()] = count.count;
  });

  dishIds.forEach(id => {
    const idString = id.toString();
    if (!result[idString]) result[idString] = 0;
  });

  return result;
};

const toReviewDto = (review: IReview): ReviewDto => {
  return ({
    _id: review._id,
    rating: review.rating,
    dishId: review.dishId,
    comment: review.comment,
    postedAt: review.postedAt,
  });
};