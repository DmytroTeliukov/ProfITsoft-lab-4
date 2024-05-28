import express from 'express';
import reviews from './reviews';

const router = express.Router();

router.use('/api/reviews', reviews);

export default router;
