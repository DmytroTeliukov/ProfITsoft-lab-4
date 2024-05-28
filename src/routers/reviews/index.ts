import {Router} from 'express';
import {
  createReview,
  getReviewsByDishId,
  getCountsByDishIds,
} from '../../controllers/reviews';

const router = Router();

router.post('', createReview);
router.get('', getReviewsByDishId);
router.post(`/_counts`, getCountsByDishIds);

export default router;
