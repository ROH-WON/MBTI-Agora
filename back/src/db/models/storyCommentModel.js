import { storyComment } from '../schemas/storyComment.js';

class storyCommentModel {
  static async createStoryComment({ newComment }) {
    const createdNewComment = await storyComment.create(newComment);
    return createdNewComment;
  }

  static async findAllByStoryId({ storyId }) {
    const storyComments = await storyComment.find({ storyId: storyId });
    const populatedComments = await storyComment.populate(storyComments, {
      path: 'writerId',
    });

    return populatedComments;
  }

  static async findOneByCommentId({ commentId }) {
    const comment = await storyComment.findOne({ _id: commentId });
    return comment;
  }

  static async updateComment({ commentId, fieldToUpdate, newValue }) {
    const filter = { _id: commentId };
    const update = { [fieldToUpdate]: newValue };
    const option = { returnOriginal: false };
    const updatedComment = await storyComment.findOneAndUpdate(
      filter,
      update,
      option,
    );
    return updatedComment;
  }

  static async deleteOneByCommentId({ commentId }) {
    const deletedComment = await storyComment.deleteOne({ _id: commentId });
    const isCompletedDeleted = deletedComment.deletedCount === 1;
    return isCompletedDeleted;
  }

  static async populateStoryComment(info, field) {
    const result = storyComment.populate(info, field);
    return result;
  }

  static async findAndCountAll(skip, limit, storyId) {
    const comments = await storyComment
      .find({ storyId: storyId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await storyComment.countDocuments({ storyId: storyId });
    return { comments, count };
  }
}

export { storyCommentModel };
