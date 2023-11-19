import { myPageService } from '../services/myPageService.js';
import { forestLike } from '../db/schemas/forestLike.js';

class myPageController {
  static async readMyStoryAndForestComments(req, res, next) {
    try {
      const userId = req.currentUserId;
      const page = parseInt(req.query.page || 1);
      const limit = 6;
      const { comments, totalPage, count } =
        await myPageService.readMyAllComments(limit, page, userId);
      const result = {
        currentPage: page,
        totalPage: totalPage,
        totalCommentsCount: count,
        myComments: comments,
      };
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async readLikeForestPosts(req, res, next) {
    try {
      const userId = req.currentUserId;
      const allPosts = await myPageService.readAllLikeForests({ userId });
      const populateResult = await myPageService.populateForestLike(
        allPosts,
        'postId',
      );

      if (populateResult.length === 0) {
        return res.status(200).json({ result: 'No LikePosts' });
      }

      return res.status(200).json(populateResult);
    } catch (error) {
      next(error);
    }
  }
}

export { myPageController };
