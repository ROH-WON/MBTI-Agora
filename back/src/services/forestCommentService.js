import { forestCommentModel } from '../db/models/forestCommentModel.js';
import { forestModel } from '../db/models/forestModel.js';
import axios from 'axios';
class forestCommentService {
  static async createForestComment({ forestId, writerId, comment, mood }) {
    if (!comment) {
      throw new Error('댓글을 입력해주세요');
    }

    const newComment = { forestId, writerId, comment, mood };

    forestModel.findAndIncreaseCommentCount({ forestId });

    const createdNewComment = await forestCommentModel.createForestComment({
      newComment,
    });
    return createdNewComment;
  }

  static async updateForestComment({ commentId, userId, updatedComment }) {
    try {
      const sentimentServerUrl = process.env.SENTIMENT_PREDICT_FLASK_SERVER_URL;

      // Request to the sentiment analysis server
      const sentimentResponse = await axios.post(sentimentServerUrl, {
        text: updatedComment,
      });

      const newMood = sentimentResponse.data.mood;

      // Check if the comment exists and if the user has the permission
      const comment = await forestCommentModel.readOneByCommentId(commentId);

      if (!comment) {
        throw new Error('수정할 댓글을 찾을 수 없습니다.');
      }

      if (comment.writerId.toString() !== userId) {
        throw new Error('작성자만 댓글을 수정할 수 있습니다.');
      }

      // Update the comment content and mood
      const updatedCommentData = await forestCommentModel.updateForestComment(
        commentId,
        updatedComment,
        newMood,
      );

      return updatedCommentData;
    } catch (error) {
      throw new Error(error);
    }
  }

  static async deleteForestComment(commentId, userId) {
    try {
      const comment = await forestCommentModel.readOneByCommentId(commentId);

      if (!comment) {
        throw new Error('수정할 댓글을 찾을 수 없습니다.');
      }

      if (comment.writerId.toString() !== userId) {
        throw new Error('작성자만 댓글을 삭제할 수 있습니다');
      }

      const deletedComment = await forestCommentModel.deleteComment(commentId);

      return {
        statusCode: 200,
        message: '댓글 삭제에 성공하셨습니다.',
        deletedComment,
      };
    } catch (error) {
      throw new Error(error);
    }
  }
  // 개별 댓글 조회 서비스
  static async readForestComment(limit, page, forestId) {
    const skip = (page - 1) * limit;
    const { comments, count } = await forestCommentModel.readAllForestComment(
      skip,
      limit,
      forestId,
    );
    const totalPage = Math.ceil(count / limit);
    return {
      statusCode: 200,
      message: '댓글 조회에 성공하셨습니다.',
      comments,
      totalPage,
      count,
    };
  }

  static async populateForestComment(info, path) {
    const field = { path: path };
    const result = forestCommentModel.populateForestComment(info, field);
    return result;
  }

  static async populateForestCommentInfo(info, field1, field2) {
    const field = {
      path: field1,
      populate: { path: field2, select: 'path' },
    };

    const result = forestCommentModel.populateForestComment(info, field);
    return result;
  }

  static async readCommentStats(forestId) {
    try {
      const allComments = await forestCommentModel.findCommentsByForestId({
        forestId,
      });
      if (!allComments) {
        return { result: 'No Comments' };
      }
      const populated = await forestCommentService.populateForestComment(
        allComments,
        'writerId',
      );

      const calculateMbtisCounts = (mood) => {
        const writers = populated
          .filter((doc) => doc.mood === mood && doc.writerId !== null)
          .map((doc) => doc.writerId);

        const allMbtis = writers.map((writer) => writer.mbti);

        return allMbtis.reduce((count, mbti) => {
          count[mbti] = (count[mbti] || 0) + 1;
          return count;
        }, {});
      };

      const pleasureMbtiCounts = calculateMbtisCounts('pleasure');
      const insecureMbtiCounts = calculateMbtisCounts('insecure');
      const sadMbtiCounts = calculateMbtisCounts('sad');
      const neutralMbtiCounts = calculateMbtisCounts('neutral');
      const surpriseMbtiCounts = calculateMbtisCounts('surprise');
      const angerMbtiCounts = calculateMbtisCounts('anger');

      const result = {
        pleasure: pleasureMbtiCounts,
        insecure: insecureMbtiCounts,
        sad: sadMbtiCounts,
        neutral: neutralMbtiCounts,
        surprise: surpriseMbtiCounts,
        anger: angerMbtiCounts,
      };

      return result;
    } catch (error) {
      console.error('MBTI 카운팅에 문제가 발생하였습니다:', error);
    }
  }
}
export { forestCommentService };
