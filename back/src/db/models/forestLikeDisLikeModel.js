import ForestPost from '../schemas/forestPost.js';
import { forestLike } from '../schemas/forestLike.js';
import { forestDislike } from '../schemas/forestDislike.js';

class forestLikeDislikeModel {
  static async createLike(session, userId, postId) {
    await forestLike.create([{ userId, postId }], { session });
    return;
  }

  static async createDislike(session, userId, postId) {
    await forestDislike.create([{ userId, postId }], { session });
    return;
  }

  static async deleteDislike(session, userId, postId) {
    const dislikeInfo = await forestDislike.findOneAndDelete(
      {
        userId,
        postId,
      },
      { session },
    );
    return dislikeInfo;
  }

  static async deleteLike(session, userId, postId) {
    const likeInfo = await forestLike.findOneAndDelete(
      {
        userId,
        postId,
      },
      { session },
    );
    return likeInfo;
  }

  static async updateClickCounts(postId, likeIncrement, dislikeIncrement) {
    await ForestPost.updateOne(
      { _id: postId },
      { $inc: { likeCount: likeIncrement, dislikeCount: dislikeIncrement } },
    );
    return;
  }

  static async findLikeForestsByUserId({ userId }) {
    const allLikeForests = await forestLike.find({ userId }); // userId : userId
    return allLikeForests;
  }

  static async findLikesByPostId({ postId }) {
    const allLikeForests = await forestLike.find({ postId });
    return allLikeForests;
  }

  static async findDislikesByPostId({ postId }) {
    const allDislikeForests = await forestDislike.find({ postId });
    return allDislikeForests;
  }

  static async findLikeInfo(userId, postId) {
    const likeInfo = await forestLike.findOne({ userId, postId });
    return likeInfo;
  }

  static async findDislikeInfo(userId, postId) {
    const disLikeInfo = await forestDislike.findOne({ userId, postId });
    return disLikeInfo;
  }

  static async populateForestLike(info, field) {
    const result = forestLike.populate(info, field);
    return result;
  }
}

export { forestLikeDislikeModel };
