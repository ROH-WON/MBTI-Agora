import { storyPostModel } from '../db/models/storyPostModel.js';
import { storyPostService } from '../services/storyPostService.js';
import { imageService } from '../services/imageService.js';
import axios from 'axios';
import moment from 'moment';

class storyPostController {
  static async createStoryPost(req, res, next) {
    try {
      const userId = req.currentUserId;
      const userInfo = userId;

      const { title, content, thumbnail, isPublic, mood, music, views } =
        req.body;
      const file = req.file ?? null;

      let thumbnailLocal;
      let thumbnailLocalId;
      let storyPostInfo;
      if (file && !thumbnail) {
        thumbnailLocal = await imageService.uploadImageInS3({ file }); // 로컬은 uploadImage({file})
        thumbnailLocalId = thumbnailLocal._id;
        storyPostInfo = await storyPostService.createStoryPost({
          userInfo,
          title,
          content,
          thumbnail: thumbnailLocalId,
          isPublic,
          mood,
          music,
          views,
        });
      } else if (!file && thumbnail) {
        storyPostInfo = await storyPostService.createStoryPost({
          userInfo,
          title,
          content,
          thumbnail: thumbnail,
          isPublic,
          mood,
          music,
          views,
        });
      } else if (!file && !thumbnail) {
        storyPostInfo = await storyPostService.createStoryPost({
          userInfo,
          title,
          content,
          thumbnail: null,
          isPublic,
          mood,
          music,
          views,
        });
      }

      const result = await storyPostService.populateStoryPost(
        storyPostInfo,
        'userInfo thumbnail',
      );
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getPredict(req, res, next) {
    try {
      const { content } = req.body;
      const pureContent = content.replace(/<[^>]+>/g, ' ');
      const obj = await axios.post(
        process.env.SENTIMENT_PREDICT_FLASK_SERVER_URL,
        {
          text: pureContent,
        },
      );
      // obj.data = { mood: '슬픔' }
      const Mood = obj.data.mood;

      // 비동기 함수
      const handlePhraseData = async (documents) => {
        let data = documents.filter((x) => x.mood === Mood);
        let Phrases = data.map((item) => item.phrase);
        let randomIndex = Math.floor(Math.random() * Phrases.length);
        let Phrase = Phrases[randomIndex];
        return Phrase;
      };

      const handleMusicData = async (documents) => {
        let data = documents.filter((x) => x.mood === Mood);
        let Musics = data.map((item) => item.music);
        let randomIndex = Math.floor(Math.random() * Musics.length);
        let Music = Musics[randomIndex];
        return Music;
      };

      const phrasePromise = storyPostModel
        .getPhraseData()
        .then(handlePhraseData);
      const musicPromise = storyPostModel.getMusicData().then(handleMusicData);

      // phrasePromise와 musicPromise를 한번에 처리
      Promise.all([phrasePromise, musicPromise])
        .then(([Phrase, Music]) => {
          const formattedMusic = Music.slice(32);
          const result = { mood: Mood, phrase: Phrase, music: formattedMusic };
          return res.status(201).json(result);
        })
        .catch((error) => {
          next(error);
        });
    } catch (error) {
      next(error);
    }
  }

  static async deleteStoryPost(req, res, next) {
    try {
      const storyId = req.params.storyId;
      const loginUserId = req.currentUserId;
      const isSameUser = await storyPostService.isSameUser(
        loginUserId,
        storyId,
      );
      if (!isSameUser) {
        throw new Error('스토리 삭제 권한이 없습니다.');
      }
      // await storyPostService.deleteUploadedImage({ storyId }); // uploads 폴더 이미지 삭제
      await imageService.deleteStoryImageInS3({ storyId });
      const result = await storyPostService.deleteStory({ storyId });
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  static async readStoryDetail(req, res, next) {
    try {
      const storyId = req.params.storyId;
      const storyInfo = await storyPostService.readStoryDetail({ storyId });
      if (!storyInfo) {
        throw new Error('스토리를 찾을 수 없습니다');
      }

      // const result = await storyPostService.populateStoryPost(
      //   storyInfo,
      //   'userInfo thumbnail',
      // );

      const result = await storyPostService.populateStoryPostInfo(
        storyInfo,
        'userInfo',
        'profileImg',
        'thumbnail',
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async readAllStories(req, res, next) {
    try {
      const page = parseInt(req.query.page || 1); // default 페이지: 1
      const limit = 8; // 한페이지에 들어갈 스토리 수

      const { option, searchword } = req.query;
      let searchQuery = {};
      let result;
      // 제목만 검색
      if (option === 'title') {
        searchQuery = { title: new RegExp(searchword, 'i') };
        const { stories, totalPage, count } =
          await storyPostService.readSeachQueryPosts(limit, page, searchQuery);
        const populateResult = await storyPostService.populateStoryPost(
          stories,
          'userInfo thumbnail',
        );

        if (populateResult.length === 0) {
          return res.status(204).json({ result: 'No Stories' });
        }

        result = {
          currentPage: page,
          totalPage: totalPage,
          totalCount: count,
          stories: populateResult,
        };
        // 내용만 검색
      } else if (option === 'content') {
        searchQuery = { content: new RegExp(searchword, 'i') };
        const { stories, totalPage, count } =
          await storyPostService.readSeachQueryPosts(limit, page, searchQuery);
        const populateResult = await storyPostService.populateStoryPost(
          stories,
          'userInfo thumbnail',
        );

        if (populateResult.length === 0) {
          return res.status(204).json({ result: 'No Stories' });
        }

        result = {
          currentPage: page,
          totalPage: totalPage,
          totalCount: count,
          stories: populateResult,
        };
        // 제목 + 내용 검색
      } else if (option === 'title_content') {
        searchQuery = {
          $or: [
            { title: new RegExp(searchword, 'i') },
            { content: new RegExp(searchword, 'i') },
          ],
        };
        const { stories, totalPage, count } =
          await storyPostService.readSeachQueryPosts(limit, page, searchQuery);
        const populateResult = await storyPostService.populateStoryPost(
          stories,
          'userInfo thumbnail',
        );

        if (populateResult.length === 0) {
          return res.status(204).json({ result: 'No Stories' });
        }

        result = {
          currentPage: page,
          totalPage: totalPage,
          totalCount: count,
          stories: populateResult,
        };
        // 모든 스토리 검색
      } else {
        const { stories, totalPage, count } = await storyPostService.readPosts(
          limit,
          page,
        );
        const populateResult = await storyPostService.populateStoryPost(
          stories,
          'userInfo thumbnail',
        );

        if (populateResult.length === 0) {
          return res.status(204).json({ result: 'No Stories' });
        }

        result = {
          currentPage: page,
          totalPage: totalPage,
          totalCount: count,
          stories: populateResult,
        };
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async readUserStory(req, res, next) {
    try {
      const page = parseInt(req.query.page || 1); // default 페이지: 1
      const limit = 8; // 한페이지에 들어갈 스토리 수
      const userId = req.currentUserId;

      const { option, searchword } = req.query;
      let searchQuery = {};
      let result;

      if (option === 'title_content') {
        searchQuery = {
          $or: [
            { title: new RegExp(searchword, 'i') },
            { content: new RegExp(searchword, 'i') },
          ],
        };
        const { stories, totalPage, count } =
          await storyPostService.readMySearchQueryPosts(
            limit,
            page,
            userId,
            searchQuery,
          );
        const populateResult = await storyPostService.populateStoryPost(
          stories,
          'userInfo thumbnail',
        );

        if (populateResult.length === 0) {
          return res.status(204).json({ result: 'No Stories' });
        }

        result = {
          currentPage: page,
          totalPage: totalPage,
          totalCount: count,
          stories: populateResult,
        };
      } else {
        const { stories, totalPage, count } =
          await storyPostService.readMyPosts(limit, page, userId);
        const populateResult = await storyPostService.populateStoryPost(
          stories,
          'userInfo thumbnail',
        );

        if (populateResult.length === 0) {
          return res.status(204).json({ result: 'No Stories' });
        }

        result = {
          currentPage: page,
          totalPage: totalPage,
          totalCount: count,
          stories: populateResult,
        };
      }
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async readMyCalender(req, res, next) {
    try {
      const userId = req.currentUserId;

      const today = moment().utcOffset(9);
      const searchYear = parseInt(req.query.year || today.year()); // default: 이번년도
      const searchMonth = parseInt(req.query.month || today.month() + 1); // default: 이번달

      // 월의 첫 날과 마지막 날 계산
      const startOfMonth = moment({
        year: searchYear,
        month: searchMonth - 1,
      })
        .startOf('month')
        .utcOffset(9);
      const endOfMonth = moment(startOfMonth).endOf('month').utcOffset(9);

      const posts = await storyPostModel.findMoodInPeriod(
        userId,
        startOfMonth,
        endOfMonth,
      );

      // posts 배열 내의 각 포스트에 대해 createdAt 값을 한국 시간대로 변환하여 koreaCreatedAt 필드에 저장
      const postsWithKoreaTime = posts.map((post) => {
        const koreaCreatedAt = moment(post.createdAt).add(9, 'hours');
        const result = {
          // ...post.toObject(),
          ...post,
          koreaCreatedAt: koreaCreatedAt,
        };
        return result;
      });

      if (postsWithKoreaTime.length === 0) {
        return res.status(200).json({ result: 'No Stories' });
      }

      return res
        .status(200)
        .json({ result: 'Success', posts: postsWithKoreaTime });
    } catch (error) {
      next(error);
    }
  }

  static async readMyMoodStatistic(req, res, next) {
    try {
      const userId = req.currentUserId;
      const myStories = await storyPostModel.findByUserId({ userId });

      if (!myStories) {
        return res.status(204).json({ result: 'No Stories' });
      }

      // 감정만 모두 추출
      const valuePercentage = await storyPostService.extractOnlyMood(myStories);
      return res.status(200).json({ result: 'Success', valuePercentage });
    } catch (error) {
      next(error);
    }
  }

  static async checkAlreadyWrite(req, res, next) {
    try {
      // const { userId } = req.body;
      const userId = req.currentUserId;
      const seoulTime = moment().utcOffset(9);
      const seoulTimeStartOfDay = seoulTime.startOf('day').utcOffset(9);
      const seoulTimeEndOfDay = moment(seoulTimeStartOfDay)
        .endOf('day')
        .utcOffset(9);

      const existingPost = await storyPostModel.isAlreadyWriteOnce(
        userId,
        seoulTimeStartOfDay,
        seoulTimeEndOfDay,
      );

      if (existingPost.length === 0) {
        return res.status(201).json({ result: false });
      } else {
        return res.status(201).json({ result: true });
      }
    } catch (error) {
      next(error);
    }
  }
}

export { storyPostController };
