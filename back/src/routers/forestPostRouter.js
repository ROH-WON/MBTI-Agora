import express from 'express';
import ForestController from '../controllers/forestController.js';
import { loginRequired } from '../middlewares/loginRequired.js';
const forestPostRouter = express.Router();

// 글 등록
forestPostRouter.post('/', loginRequired, ForestController.createPost);

// 게시글 조회
forestPostRouter.get('/', ForestController.findByForest);

// 글 감정분석
forestPostRouter.post(
  '/senti-predict',
  loginRequired,
  ForestController.getPredict,
);

forestPostRouter.get('/popularity', ForestController.getForestsByPopularity);

forestPostRouter.get(
  '/popularity/mbti',
  ForestController.getForestMBTIByPopularity,
);

// 사용자의 게시물 조회
forestPostRouter.get('/my', loginRequired, ForestController.getUserPosts);

forestPostRouter.get('/mbti', ForestController.getPostsByAuthorMBTI);

forestPostRouter.get('/:forestId', ForestController.readForestDetail);

// 글 수정
forestPostRouter.put('/:id', loginRequired, ForestController.updatePost);

// 글 삭제
forestPostRouter.delete('/:id', loginRequired, ForestController.deletePost);

export { forestPostRouter };
