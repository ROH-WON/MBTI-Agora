// // forestModel.js
import ForestPost from '../schemas/forestPost.js';
import { forestComment } from '../schemas/forestComment.js';
class forestModel {
  static async create({ newForestPost }) {
    const createdForest = await ForestPost.create(newForestPost);
    return createdForest;
  }

  static async findOneAndUpdate({ forestId, title, content, mood }) {
    const updatedPost = await ForestPost.updateOne(
      { _id: forestId }, // 업데이트할 문서의 조건
      { title: title, content: content, mood: mood }, // 업데이트할 필드 및 값);
      { new: true },
    );

    if (!updatedPost) {
      return null;
    }
    // 여기서 population을 수행하여 필요한 필드를 채워줍니다.
    const populatedPost = await ForestPost.populate(updatedPost, 'userInfo');

    return populatedPost;
  }

  static async findOneAndDelete({ forestId }) {
    const deletedPost = await ForestPost.deleteOne({ _id: forestId });
    return deletedPost;
  }

  static async findByForest(skip, limit, getAlls) {
    const readForest = { ...getAlls };
    const forests = await ForestPost.find(readForest)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    // 댓글 갯수 조회 및 추가
    for (const forest of forests) {
      const commentCount = await forestComment.countDocuments({
        forestId: forest._id,
      });
      forest.commentCount = commentCount;
    }
    const count = await ForestPost.countDocuments(readForest);
    return { forests, count };
  }

  static async readOneById({ forestId }) {
    const forest = await ForestPost.findOne({ _id: forestId });
    return forest;
  }

  // 조회수 1증가
  static async findAndIncreaseView({ forestId }) {
    const updatedForest = await ForestPost.findOneAndUpdate(
      { _id: forestId }, // 업데이트할 문서를 찾는 조건으로 _id 필드 사용
      { $inc: { views: 1 } }, // 업데이트할 필드와 값
      { new: true }, // 업데이트 후 업데이트된 문서 반환
    ).lean();

    return updatedForest;
  }

  static async findAndCountAll(skip, limit) {
    const forest = await ForestPost.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await ForestPost.countDocuments();
    return { forest, count };
  }

  static async findByUser(userId, skip, limit) {
    const readUser = { userInfo: userId };
    const forests = await ForestPost.find(readUser)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const count = await ForestPost.countDocuments(readUser);
    return { forests, count };
  }

  static async populateForestPost(info, field) {
    const forest = ForestPost.populate(info, field);
    return forest;
  }

  static async findAndIncreaseCommentCount({ forestId }) {
    await ForestPost.updateOne(
      { _id: forestId },
      { $inc: { commentCount: 1 } },
    );
  }

  static async findAndDecreaseCommentCount({ forestId }) {
    await ForestPost.updateOne(
      { _id: forestId, commentCount: { $gt: 0 } },
      { $inc: { commentCount: -1 } },
    );
  }

  static async findByForestMbti({ mbtiList, skip, limit }) {
    try {
      console.log('Finding posts with MBTI:', mbtiList);
      console.log('Skip:', skip);
      console.log('Limit:', limit);

      let matchQuery = {};
      if (mbtiList && mbtiList.length > 0 && mbtiList[0] !== '') {
        matchQuery = {
          'userInfo.mbti': {
            $in: mbtiList,
          },
        };
      }

      const posts = await ForestPost.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userInfo',
            foreignField: '_id',
            as: 'userInfo',
          },
        },
        {
          $unwind: '$userInfo',
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $match: matchQuery,
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);

      let countQuery = matchQuery;
      if (!mbtiList || mbtiList.length === 0 || mbtiList[0] === '') {
        countQuery = {};
      }

      const countResults = await ForestPost.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userInfo',
            foreignField: '_id',
            as: 'userInfo',
          },
        },
        {
          $unwind: '$userInfo',
        },
        {
          $match: countQuery,
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]);

      const count = countResults.length > 0 ? countResults[0].count : 0;

      return { posts, count };
    } catch (error) {
      throw new Error(
        `Error finding blog posts by author's MBTI: ${error.message}`,
      );
    }
  }

  static async findPopularAndCountAll(skip, limit) {
    const forest = await ForestPost.find({})
      .sort({ likeCount: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const count = await ForestPost.countDocuments();
    return { forest, count };
  }

  static async populateForestAll(info, field1, field2) {
    const result1 = await ForestPost.populate(info, field1);
    const result2 = await ForestPost.populate(result1, field2);
    return result2;
  }

  static async findByForestMbtiPopular({ mbtiList, skip, limit }) {
    try {
      let matchQuery = {};
      if (mbtiList && mbtiList.length > 0 && mbtiList[0] !== '') {
        matchQuery = {
          'userInfo.mbti': {
            $in: mbtiList,
          },
        };
      }

      const posts = await ForestPost.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userInfo',
            foreignField: '_id',
            as: 'userInfo',
          },
        },
        {
          $unwind: '$userInfo',
        },
        {
          $match: matchQuery,
        },
        {
          $sort: { likeCount: -1 },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
      ]);

      let countQuery = matchQuery;
      if (!mbtiList || mbtiList.length === 0 || mbtiList[0] === '') {
        countQuery = {};
      }

      const countResults = await ForestPost.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'userInfo',
            foreignField: '_id',
            as: 'userInfo',
          },
        },
        {
          $unwind: '$userInfo',
        },
        {
          $match: countQuery,
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
          },
        },
      ]);

      const count = countResults.length > 0 ? countResults[0].count : 0;

      return { posts, count };
    } catch (error) {
      throw new Error(
        `Error finding blog posts by author's MBTI: ${error.message}`,
      );
    }
  }
}

export { forestModel };
