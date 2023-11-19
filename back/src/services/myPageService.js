import { myPageModel } from '../db/models/myPageModel.js';
import { forestLikeDislikeModel } from '../db/models/forestLikeDisLikeModel.js';

class myPageService {
  static async readMyAllComments(limit, page, userId) {
    const skip = (page - 1) * limit;
    const { comments, count } = await myPageModel.findMyAllCommentAndCount(
      userId,
      skip,
      limit,
    );
    const totalPage = Math.ceil(count / limit);
    return { comments, totalPage, count };
  }

  static async readAllLikeForests({ userId }) {
    const allPosts = await forestLikeDislikeModel.findLikeForestsByUserId({
      userId,
    });
    return allPosts;
  }

  static async populateForestLike(info, path) {
    const field = { path: path };
    const result = forestLikeDislikeModel.populateForestLike(info, field);
    return result;
  }
}

export { myPageService };
