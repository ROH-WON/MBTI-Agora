import { Router } from 'express';
import { loginRequired } from '../middlewares/loginRequired.js';
import { forestLikeDislikeController } from '../controllers/forestLikeDislikeController.js';

const forestLikeDislikeRouter = Router();

forestLikeDislikeRouter.post(
  '/:postId/upLike',
  loginRequired,
  forestLikeDislikeController.createForestPostLike,
);

forestLikeDislikeRouter.get(
  '/:postId/getLikes',
  forestLikeDislikeController.readForestPostLikes,
);

forestLikeDislikeRouter.post(
  '/:postId/upDislike',
  loginRequired,
  forestLikeDislikeController.createForestPostDislike,
);

forestLikeDislikeRouter.get(
  '/:postId/getDislikes',
  forestLikeDislikeController.readForestPostDisikes,
);

forestLikeDislikeRouter.delete(
  '/:postId/unLike',
  loginRequired,
  forestLikeDislikeController.deleteForestPostLike,
);

forestLikeDislikeRouter.delete(
  '/:postId/unDislike',
  loginRequired,
  forestLikeDislikeController.deleteForestPostDislike,
);

export { forestLikeDislikeRouter };
