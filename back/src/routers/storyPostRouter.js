import { Router } from 'express';
import { loginRequired } from '../middlewares/loginRequired.js';
import { storyPostController } from '../controllers/storyPostController.js';
// import { upload } from '../utills/multer.js';
import { uploadS3 } from '../utills/multer.js';

const storyPostRouter = Router();

storyPostRouter.post(
  '/',
  loginRequired,
  uploadS3.single('thumbnail'),
  storyPostController.createStoryPost,
);

storyPostRouter.get('/', storyPostController.readAllStories);

storyPostRouter.post(
  '/isAlreadyWrote',
  loginRequired,
  storyPostController.checkAlreadyWrite,
);

storyPostRouter.post(
  '/recommend',
  loginRequired,
  storyPostController.getPredict,
);

// 감정 통계
storyPostRouter.get(
  '/my/moodStat',
  loginRequired,
  storyPostController.readMyMoodStatistic,
);

// 한달치 내 스토리별 감정 조회 (감정 정보만 return)
storyPostRouter.get(
  '/my/calendar',
  loginRequired,
  storyPostController.readMyCalender,
);

// 내 스토리 전체 조회 (스토리 전체 정보 return)
storyPostRouter.get('/my', loginRequired, storyPostController.readUserStory);

storyPostRouter.get('/:storyId', storyPostController.readStoryDetail);

storyPostRouter.delete(
  '/:storyId',
  loginRequired,
  storyPostController.deleteStoryPost,
);

export { storyPostRouter };
