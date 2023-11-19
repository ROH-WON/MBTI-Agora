import { storyCommentModel } from '../db/models/storyCommentModel.js';
import { storyPostModel } from '../db/models/storyPostModel.js';
import mongoose from 'mongoose';

class storyCommentService {
  static async createStoryComment({ storyId, writerId, comment, mood }) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const newComment = { storyId, writerId, comment, mood };

      await storyPostModel.findAndIncreaseCommentCount(session, { storyId });

      const createdNewComment = await storyCommentModel.createStoryComment({
        newComment,
      });

      // 트랜잭션 커밋
      await session.commitTransaction();

      return createdNewComment;
    } catch (error) {
      // 트랜잭션 롤백
      await session.abortTransaction();
      console.error('Transaction aborted:', error);
    } finally {
      session.endSession();
    }
  }

  static async updateStoryComment({ commentId, toUpdate }) {
    let comment = await storyCommentModel.findOneByCommentId({ commentId });

    if (!comment) {
      throw new Error('해당 댓글을 찾을 수 없습니다. 다시 한번 확인해부세요');
    }

    if (toUpdate.comment) {
      const fieldToUpdate = 'comment';
      const newValue = toUpdate.comment;
      comment = await storyCommentModel.updateComment({
        commentId,
        fieldToUpdate,
        newValue,
      });
    }

    if (toUpdate.mood) {
      const fieldToUpdate = 'mood';
      const newValue = toUpdate.mood;
      comment = await storyCommentModel.updateComment({
        commentId,
        fieldToUpdate,
        newValue,
      });
    }

    return comment;
  }

  static async deleteStoryComment({ commentId }) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const commentInfo = await storyCommentModel.findOneByCommentId({
        commentId,
      });
      const storyId = commentInfo.storyId;
      await storyPostModel.findAndDecreaseCommentCount(session, { storyId });
      let isDeleted = await storyCommentModel.deleteOneByCommentId({
        commentId,
      });
      if (!isDeleted) {
        throw new Error('삭제할 댓글 정보가 없습니다.');
      }
      // 트랜잭션 커밋
      await session.commitTransaction();
      return { result: 'Success' };
    } catch (error) {
      // 트랜잭션 롤백
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  }

  static async populateStoryComment(info, path) {
    const field = { path: path };
    const result = storyCommentModel.populateStoryComment(info, field);
    return result;
  }

  static async populateStoryCommentInfo(info, field1, field2) {
    const field = {
      path: field1,
      populate: { path: field2, select: 'path' },
    };

    const result = storyCommentModel.populateStoryComment(info, field);
    return result;
  }

  static async readComments(limit, page, storyId) {
    const skip = (page - 1) * limit;
    const { comments, count } = await storyCommentModel.findAndCountAll(
      skip,
      limit,
      storyId,
    );
    const totalPage = Math.ceil(count / limit);
    return { comments, totalPage, count };
  }

  static async isSameUser(loginUserId, commentId) {
    const comments = await storyCommentModel.findOneByCommentId({ commentId });

    const commentWriterId = comments.writerId;

    return loginUserId == commentWriterId;
  }
}

export { storyCommentService };
