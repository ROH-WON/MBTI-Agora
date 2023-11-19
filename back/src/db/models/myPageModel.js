import { storyComment } from '../schemas/storyComment.js';
import { forestComment } from '../schemas/forestComment.js';
import { storyPost } from '../schemas/storyPost.js';
import ForestPost from '../schemas/forestPost.js';

class myPageModel {
  static async findMyAllCommentAndCount(userId, skip, limit) {
    const allStoryComments = await storyComment.find({ writerId: userId });
    const allForestComments = await forestComment.find({ writerId: userId });
    const mergedComments = [...allStoryComments, ...allForestComments];

    // 댓글에 연관된 스토리나 포레스트 정보를 가져오기 위해 관련 ID를 추출
    const storyIds = mergedComments.map((comment) => comment.storyId);
    const forestIds = mergedComments.map((comment) => comment.forestId);

    // 스토리와 포레스트 정보를 가져옵니다.
    const stories = await storyPost.find({ _id: { $in: storyIds } });
    const forests = await ForestPost.find({ _id: { $in: forestIds } });

    // 가져온 스토리와 포레스트 정보를 사용하여 댓글을 populate합니다.
    mergedComments.forEach((comment) => {
      if (comment.storyId) {
        const story = stories.find((story) =>
          story._id.equals(comment.storyId),
        );
        comment.storyId = story;
        // console.log(story)
      }
      if (comment.forestId) {
        const forest = forests.find((forest) =>
          forest._id.equals(comment.forestId),
        );
        comment.forestId = forest;
      }
    });

    // 모든 댓글을 createdAt을 기준으로 최신순으로 정렬
    mergedComments.sort((a, b) => b.createdAt - a.createdAt);

    // 페이지네이션을 적용하여 원하는 범위의 댓글을 가져옵니다.
    const paginatedComments = mergedComments.slice(skip, skip + limit);
    const count = mergedComments.length;
    return { comments: paginatedComments, count };
  }
}

export { myPageModel };
