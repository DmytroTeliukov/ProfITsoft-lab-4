import bodyParser from 'body-parser';
import express from 'express';
import sinon from 'sinon';
import chai from 'chai';
import chaiHttp from 'chai-http';
import routers from "../../routers/reviews";
import {ReviewSaveDto} from "../../dto/review/reviewSaveDto";
import * as dishServiceClient from '../../client/dishes';
import {ObjectId} from "mongodb";
import {ReviewCountQueryDto} from "../../dto/review/reviewCountQueryDto";
import Review from "../../model/review";
import mongoSetup from "../mongoSetup";

const {expect} = chai;

chai.use(chaiHttp);
chai.should();

const sandbox = sinon.createSandbox();

const app = express();

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


app.use(bodyParser.json({limit: '1mb'}));
app.use('/', routers);

describe('Review Controller', () => {

  before(async () => {
    await mongoSetup;
    await review1.save();
    await review2.save();
    await review3.save();
  });

  afterEach(() => {
    sandbox.restore();
  });


  it('should create a review', (done) => {
    const groupIdAfterSave = new ObjectId();
    const reviewDto: ReviewSaveDto = {
      rating: 5,
      comment: 'Excellent!',
      dishId: 1,
    };

    const createReviewStub = sandbox.stub(
      Review.prototype,
      'save',
    );
    createReviewStub.resolves({
      ...reviewDto,
      _id: groupIdAfterSave,
      postedAt: Date.now(),
    });

    const checkDishExistsStub = sandbox.stub(dishServiceClient, 'checkDishExistsById').resolves(true);

    chai.request(app)
      .post('')
      .send(reviewDto)
      .end((_, res) => {
        expect(res).to.have.status(201);
        expect(res.body.id).to.equal(groupIdAfterSave.toString());
        expect(createReviewStub.calledOnce).to.be.true;
        expect(checkDishExistsStub.calledOnce).to.be.true;
        done();
      });
  });

  it('should throw error if dish by id not exist', (done) => {
    const reviewDto: ReviewSaveDto = {
      rating: 5,
      comment: 'Excellent!',
      dishId: 1,
    };

    const checkDishExistsStub = sandbox.stub(dishServiceClient, 'checkDishExistsById').resolves(false);

    chai.request(app)
      .post('')
      .send(reviewDto)
      .end((_, res) => {
        expect(res).to.have.status(404);
        expect(checkDishExistsStub.calledOnce).to.be.true;
        done();
      });
  });


  it('should return reviews by dishId', (done) => {
    chai.request(app)
      .get('')
      .query({dishId: 1, size: 10, from: 0})
      .end((_, res) => {
        res.should.have.status(200);
        expect(res.body.length).to.deep.equal(2);
        done();
      });
  });

  it('should return counts by dishIds', (done) => {
    const counts = {'1': 2, '2': 1};
    const query: ReviewCountQueryDto = {dishIds: [1, 2]};

    chai.request(app)
      .post('/_counts')
      .send(query)
      .end((_, res) => {
        res.should.have.status(200);
        console.log(res.body);
        expect(res.body).to.deep.equal(counts);
        done();
      });
  });
});
