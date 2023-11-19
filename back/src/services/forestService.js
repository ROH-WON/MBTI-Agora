import { forestModel } from '../db/models/forestModel.js';
import ForestPost from '../db/schemas/forestPost.js';
import { forestCommentModel } from '../db/models/forestCommentModel.js';
class ForestService {
  static async createPost({ userInfo, title, content, mood }) {
    if (!title || !content) {
      const errorMessage = '제목과 내용은 필수 입력 사항입니다.';
      throw new Error(errorMessage);
    }

    const newForestPost = {
      userInfo,
      title,
      content,
      mood,
    };

    const createdForestPost = await forestModel.create({ newForestPost });
    return createdForestPost;
  }

  static async findByForest(limit, page, getAlls) {
    const skip = (page - 1) * limit;
    // console.log(getAlls, getAlls.content);

    const { forests, count } = await forestModel.findByForest(
      skip,
      limit,
      getAlls,
    );
    const totalPage = Math.ceil(count / limit);

    return { forests, totalPage, count };
  }

  static async findByUserPosts(loginUserId, limit, page) {
    try {
      const skip = (page - 1) * limit;

      // 유저가 작성한 게시물만 조회하는 로직 추가
      const { forests, count } = await forestModel.findByUser(
        loginUserId,
        skip,
        limit,
      );

      const totalPage = Math.ceil(count / limit);
      return { forests, totalPage, count };
    } catch (error) {
      throw new Error('Error while fetching user posts: ' + error.message);
    }
  }

  static async updatePost({ forestId, title, content, mood }) {
    const updatedPost = await forestModel.findOneAndUpdate(
      { forestId, title, content, mood }, // 업데이트할 문서를 찾는 조건으로 _id 필드 사용
    );
    if (!updatedPost) {
      return null; // 수정된 게시글이 없는 경우 null 반환
    }
    return updatedPost;
  }

  static async deletePost({ forestId }) {
    const deletedPost = await forestModel.findOneAndDelete({ forestId });
    if (!deletedPost) {
      throw new Error('삭제할 게시글 정보가 없습니다.');
    }
    return deletedPost;
  }

  static async isSameUser(loginUserId, forestId) {
    const forests = await forestModel.readOneById({ forestId });
    const forestUserId = forests.userInfo;
    return loginUserId == forestUserId;
  }

  static async readOneById({ forestId }) {
    try {
      const forest = await forestModel.readOneById({ forestId });

      if (!forest) {
        throw new Error('존재하지 않는 글입니다.');
      }
      return forest;
    } catch (error) {
      throw new Error('글 조회에 실패했습니다.');
    }
  }

  static async readForestDetail({ forestId }) {
    const forest = await forestModel.findAndIncreaseView({ forestId });
    const allComment = await forestCommentModel.findAllByForestId({ forestId });
    const commentCount = allComment.length;
    if (!forest) {
      throw new Error('해당 게시물이 존재하지 않습니다.');
    }

    const forestInfo = {
      ...forest,
      commentCount: commentCount,
      commentList: allComment,
    };
    return forestInfo;
  }

  static async readPosts(limit, page) {
    const skip = (page - 1) * limit; // 해당 페이지에서 스킵할 스토리 수

    const { forest, count } = await forestModel.findAndCountAll(skip, limit);
    const totalPage = Math.ceil(count / limit);
    return { forest, totalPage, count }; // 해당 페이지에 해당하는 스토리들, 총 페이지 수, 스토리 총 수
  }

  static async populateForestPost(info, path) {
    const field = { path: path };
    const forest = forestModel.populateForestPost(info, field);
    return forest;
  }

  static async populateForestInfo(info, field1, field2) {
    const field = { path: field1, populate: { path: field2, select: 'path' } };
    const result = await forestModel.populateForestPost(info, field);

    return result;
  }

  static async findById(forestId) {
    try {
      return await forestModel.readOneById(forestId);
    } catch (error) {
      throw new Error('An error occurred while fetching the forest.');
    }
  }

  static async findByForestMbti({ mbtiList, limit, page }) {
    try {
      const skip = (page - 1) * limit;
      const { posts, count } = await forestModel.findByForestMbti({
        mbtiList,
        limit,
        skip,
      }); // 이 부분 수정
      console.log('MBTI List:', mbtiList);
      console.log('Limit:', limit);
      console.log('Skip:', skip);
      console.log('Count:', count);

      const totalPage = Math.ceil(count / limit);
      // 나머지 로직 유지
      return { posts, totalPage, count };
    } catch (error) {
      throw new Error(
        `Error finding blog posts by author's MBTI: ${error.message}`,
      );
    }
  }

  static async readPopularPosts(limit, page) {
    const skip = (page - 1) * limit; // 해당 페이지에서 스킵할 스토리 수

    const { forest, count } = await forestModel.findPopularAndCountAll(
      skip,
      limit,
    );
    const totalPage = Math.ceil(count / limit);
    return { forest, totalPage, count }; // 해당 페이지에 해당하는 스토리들, 총 페이지 수, 스토리 총 수
  }

  static async findByForestMbtiPopular({ mbtiList, limit, page }) {
    try {
      const skip = (page - 1) * limit;
      const { posts, count } = await forestModel.findByForestMbtiPopular({
        mbtiList,
        limit,
        skip,
      }); // 이 부분 수정

      const totalPage = Math.ceil(count / limit);
      // 나머지 로직 유지
      return { posts, totalPage, count };
    } catch (error) {
      throw new Error(
        `Error finding blog posts by author's MBTI: ${error.message}`,
      );
    }
  }
}

export default ForestService;
