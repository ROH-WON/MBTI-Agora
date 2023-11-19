import { storyCommentService } from '../services/storyCommentService.js';
import axios from 'axios';

class storyCommentController {
  static async createStoryComment(req, res, next) {
    try {
      const storyId = req.params.storyId;
      const writerId = req.currentUserId;
      const { comment } = req.body;
      if (!comment) {
        throw new Error('댓글을 입력해주세요');
      }
      const obj = await axios.post(
        process.env.SENTIMENT_PREDICT_FLASK_SERVER_URL,
        {
          text: comment,
        },
      );
      const mood = obj.data.mood;
      const newComment = await storyCommentService.createStoryComment({
        storyId,
        writerId,
        comment,
        mood,
      });

      const result = await storyCommentService.populateStoryComment(
        newComment,
        'storyId writerId',
      );
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async updateStoryComment(req, res, next) {
    try {
      const commentId = req.params.commentId;
      const loginUserId = req.currentUserId;
      const isSameUser = await storyCommentService.isSameUser(
        loginUserId,
        commentId,
      );
      if (!isSameUser) {
        throw new Error('댓글 수정 권한이 없습니다.');
      }
      const { comment } = req.body;
      if (!comment) {
        throw new Error('댓글을 입력해주세요');
      }
      const obj = await axios.post(
        process.env.SENTIMENT_PREDICT_FLASK_SERVER_URL,
        {
          text: comment,
        },
      );
      const mood = obj.data.mood;
      const toUpdate = { comment, mood };

      const updatedComment = await storyCommentService.updateStoryComment({
        commentId,
        toUpdate,
      });

      const result = await storyCommentService.populateStoryComment(
        updatedComment,
        'storyId writerId',
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async deleteStoryComment(req, res, next) {
    try {
      const commentId = req.params.commentId;
      const loginUserId = req.currentUserId;
      const isSameUser = await storyCommentService.isSameUser(
        loginUserId,
        commentId,
      );
      if (!isSameUser) {
        throw new Error('댓글 삭제 권한이 없습니다.');
      }
      const result = await storyCommentService.deleteStoryComment({
        commentId,
      });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  static async readStoryComment(req, res, next) {
    try {
      const storyId = req.params.storyId;
      const page = parseInt(req.query.page || 1);
      const limit = 6;
      const { comments, totalPage, count } =
        await storyCommentService.readComments(limit, page, storyId);
      // const populageResult = await storyCommentService.populateStoryComment(
      //   comments,
      //   'writerId',
      // );

      const populageResult = await storyCommentService.populateStoryCommentInfo(
        comments,
        'writerId',
        'profileImg',
      );
      const result = {
        currentPage: page,
        totalPage: totalPage,
        totalCommentsCount: count,
        comments: populageResult,
      };
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export { storyCommentController };
