import { storyPostModel } from '../db/models/storyPostModel.js';
import { storyCommentModel } from '../db/models/storyCommentModel.js';

class storyPostService {
  static async createStoryPost({
    userInfo,
    title,
    content,
    thumbnail,
    isPublic,
    mood,
    music,
    views,
  }) {
    if (!title || !content) {
      throw new Error('제목, 내용 모두 입력해주세요');
    }
    const newStoryPost = {
      userInfo,
      title,
      content,
      thumbnail,
      isPublic,
      mood,
      music,
      views,
    };
    const createdNewStoryPost = await storyPostModel.createStoryPost({
      newStoryPost,
    });
    return createdNewStoryPost;
  }

  static async deleteStory({ storyId }) {
    let isDeleted = await storyPostModel.deleteOneByStoryId({ storyId });
    if (!isDeleted) {
      throw new Error('삭제할 게시글 정보가 없습니다.');
    }
    return { result: 'Success' };
  }

  static async readStoryDetail({ storyId }) {
    const story = await storyPostModel.findAndIncreaseView({ storyId });
    const allComments = await storyCommentModel.findAllByStoryId({ storyId });

    if (!story) {
      throw new Error('해당 스토리가 존재하지 않습니다.');
    }

    const storyInfo = {
      ...story,
      // commentCount: allComments.length,
      commentList: allComments,
    };
    return storyInfo;
  }

  static async readPosts(limit, page) {
    const skip = (page - 1) * limit; // 해당 페이지에서 스킵할 스토리 수

    const { stories, count } = await storyPostModel.findAndCountAll(
      skip,
      limit,
    );
    const totalPage = Math.ceil(count / limit);
    return { stories, totalPage, count }; // 해당 페이지에 해당하는 스토리들, 총 페이지 수, 스토리 총 수
  }

  static async readSeachQueryPosts(limit, page, searchQuery) {
    const skip = (page - 1) * limit; // 해당 페이지에서 스킵할 스토리 수

    const { stories, count } = await storyPostModel.findSearchQueryAndCountAll(
      skip,
      limit,
      searchQuery,
    );
    const totalPage = Math.ceil(count / limit);
    return { stories, totalPage, count }; // 해당 페이지에 해당하는 스토리들, 총 페이지 수, 스토리 총 수
  }

  static async readMyPosts(limit, page, userId) {
    const skip = (page - 1) * limit; // 해당 페이지에서 스킵할 스토리 수

    const { stories, count } =
      await storyPostModel.findMySearchQueryAndCountAll(skip, limit, userId);
    const totalPage = Math.ceil(count / limit);
    return { stories, totalPage, count }; // 해당 페이지에 해당하는 스토리들, 총 페이지 수, 스토리 총 수
  }

  static async readMySearchQueryPosts(limit, page, userId, searchQuery) {
    const skip = (page - 1) * limit; // 해당 페이지에서 스킵할 스토리 수

    const { stories, count } =
      await storyPostModel.findMySearchQueryAndCountAll(
        skip,
        limit,
        userId,
        searchQuery,
      );
    const totalPage = Math.ceil(count / limit);
    return { stories, totalPage, count }; // 해당 페이지에 해당하는 스토리들, 총 페이지 수, 스토리 총 수
  }

  static async populateStoryPost(info, path) {
    const field = { path: path };
    const result = storyPostModel.populateStoryPost(info, field);
    return result;
  }

  static async populateStoryPostInfo(info, field1, field2, field3) {
    const fieldA = { path: field1, populate: { path: field2, select: 'path' } };
    const fieldB = { path: field3 };

    const result = await storyPostModel.populateStoryAll(info, fieldA, fieldB);

    return result;
  }

  static async isSameUser(loginUserId, storyId) {
    const stories = await storyPostModel.findOneByStoryId({ storyId });
    const storyUserId = stories.userInfo;
    if (loginUserId == storyUserId) {
      return true;
    } else {
      return false;
    }
  }

  static async extractOnlyMood(myStories) {
    let allMoods = [];
    myStories.forEach((myStory) => {
      allMoods.push(myStory.mood);
    });

    const valueCount = allMoods.reduce((counts, value) => {
      if (!counts[value]) {
        counts[value] = 1;
      } else {
        counts[value]++;
      }
      return counts;
    }, {});

    let valuePercentage = {};
    const totalCount = allMoods.length;
    for (const value in valueCount) {
      valuePercentage[value] = (valueCount[value] / totalCount) * 100;
    }
    return valuePercentage;
  }

  // static async deleteUploadedImage({ storyId }) {
  //   const story = await storyPostModel.findOneByStoryId({ storyId });
  //   const uploadImage = await imageModel.findOneByImageId({
  //     imageId: story.thumbnail,
  //   });
  //   if (uploadImage) {
  //     const uploadImagePath = uploadImage.path;
  //     if (fs.existsSync(uploadImagePath)) {
  //       fs.unlinkSync(uploadImagePath);
  //     } else {
  //       console.log('File does not exist, so not deleting.');
  //     }
  //   } else {
  //   }
  // }
}

export { storyPostService };
