import { Request, Response } from 'express';
import {ReviewSaveDto} from "../../dto/review/reviewSaveDto";
import {ReviewCountQueryDto} from "../../dto/review/reviewCountQueryDto";
import {
  createReview as createReviewApi,
  getReviewsByDishId as getReviewsByDishIdApi,
  getCountsByDishIds as getCountsByDishIdsApi,
} from "../../services/review";
import {handleError} from "../handleError";

export const createReview = async (req: Request, res: Response) => {
  try {
    const data = new ReviewSaveDto(req.body);
    const reviewId = await createReviewApi(data);

    res.status(201).json({id: reviewId});
  } catch (error) {
    handleError(error, res, 'Error in creating review.');
  }
};

export const getReviewsByDishId = async (req: Request, res: Response) => {
  try {
    const { dishId } = req.query;
    const size = parseInt(req.query.size as string) || 10;
    const from = parseInt(req.query.from as string) || 0;
    const reviews = await getReviewsByDishIdApi(Number(dishId), size, from);

    res.json(reviews);
  } catch (error) {
    handleError(error, res, 'Error in retrieving reviews.');
  }
};

export const getCountsByDishIds = async (req: Request, res: Response) => {
  try {
    const data = new ReviewCountQueryDto(req.body);
    const counts = await getCountsByDishIdsApi(data);

    res.json(counts);
  } catch (error) {
    handleError(error, res, 'Error in retrieving count of reviews.');
  }
};