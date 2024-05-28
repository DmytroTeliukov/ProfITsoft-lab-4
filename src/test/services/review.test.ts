import chai from 'chai';
import sinon from 'sinon';
import { ObjectId } from 'mongodb';
import mongoSetup from '../mongoSetup';
import Review from "../../model/review";
import * as reviewService from '../../services/review';
import * as dishServiceClient from '../../client/dishes';
import {ReviewSaveDto} from "../../dto/review/reviewSaveDto";
import {ReviewCountQueryDto} from "../../dto/review/reviewCountQueryDto";

const { expect } = chai;
const sandbox = sinon.createSandbox();

const review1 = new Review({
  _id: new ObjectId(),
  rating: 5,
  comment: 'Great dish!',
  dishId: 1,
  postedAt: new Date(),
});

const review2 = new Review({
  _id: new ObjectId(),
  rating: 4,
  comment: 'Good dish',
  dishId: 1,
  postedAt: new Date(),
});

const review3 = new Review({
  _id: new ObjectId(),
  rating: 3,
  comment: 'Okay dish',
  dishId: 2,
  postedAt: new Date(),
});

describe('Review Service', () => {
  before(async () => {
    await mongoSetup;
    await review1.save();
    await review2.save();
    await review3.save();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('createReview should create a new review and return it', (done) => {
    const reviewDto: ReviewSaveDto = {
      rating: 5,
      comment: 'Excellent!',
      dishId: 3,
    };

    sandbox.stub(dishServiceClient, 'checkDishExistsById').resolves(true);

    reviewService.createReview(reviewDto)
      .then(async (reviewId) => {
        const createdReview = await Review.findById(reviewId);
        expect(createdReview).to.exist;
        expect(createdReview?.rating).to.equal(reviewDto.rating);
        expect(createdReview?.comment).to.equal(reviewDto.comment);
        expect(createdReview?.dishId).to.equal(reviewDto.dishId);
        done();
      })
      .catch((error) => done(error));
  });

  it('createReview should throw error if dish does not exist', (done) => {
    const reviewDto: ReviewSaveDto = {
      rating: 4,
      comment: 'Not bad',
      dishId: 999,
    };

    sandbox.stub(dishServiceClient, 'checkDishExistsById').resolves(false);

    reviewService.createReview(reviewDto)
      .catch((error) => {
        expect(error.message).to.equal('Dish not found!');
        done();
      });
  });

  it('getReviewsByDishId should return reviews for a dish', (done) => {
    reviewService.getReviewsByDishId(1, 10, 0)
      .then((reviews) => {
        expect(reviews.length).to.equal(2);
        expect(reviews[0].rating).to.equal(4);
        expect(reviews[1].rating).to.equal(5);
        done();
      })
      .catch((error) => done(error));
  });

  it('getCountsByDishIds should return counts for each dish ID', (done) => {
    const expectedCounts = {'1': 2, '2': 1};
    const query: ReviewCountQueryDto = { dishIds: [1, 2] };

    reviewService.getCountsByDishIds(query)
      .then((counts) => {
        expect(counts).to.deep.equal(expectedCounts);
        done();
      })
      .catch((error) => done(error));
  });
});