import { Router } from 'express';
import { userAuthRouter } from './userAuthRouter.js';
import { storyPostRouter } from './storyPostRouter.js';
import { storyCommentRouter } from './storyCommentRouter.js';
import { myPageRouter } from './myPageRouter.js';
import { imageRouter } from './imageRouter.js';
import { forestPostRouter } from './forestPostRouter.js';
import { forestLikeDislikeRouter } from './forestLikeDislikeRouter.js';
import { forestCommentRouter } from './forestCommentRouter.js';

const router = Router();

router.use('/auth', userAuthRouter);
router.use('/stories', storyPostRouter);
router.use('/stories', storyCommentRouter);
router.use('/my', myPageRouter);
router.use('/image', imageRouter);
router.use('/forest', forestPostRouter);
router.use('/forest', forestLikeDislikeRouter);
router.use('/forest', forestCommentRouter);

export { router };
