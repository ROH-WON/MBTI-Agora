// forestPost.js
import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const ForestPostSchema = new Schema(
  {
    userInfo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      required: true,
      default: 0,
    },
    commentCount: {
      type: Number,
      required: true,
      default: 0,
    },
    likeCount: {
      type: Number,
      required: true,
      default: 0,
    },
    dislikeCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true, collection: 'forestPosts' },
);

const ForestPost = model('ForestPost', ForestPostSchema);

export default ForestPost;
