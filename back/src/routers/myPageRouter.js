import { Router } from 'express';
import { loginRequired } from '../middlewares/loginRequired.js';
import { myPageController } from '../controllers/myPageController.js';

const myPageRouter = Router();

myPageRouter.get(
  '/allComments',
  loginRequired,
  myPageController.readMyStoryAndForestComments,
);

myPageRouter.get(
  '/likeForestPosts',
  loginRequired,
  myPageController.readLikeForestPosts,
);

export { myPageRouter };
