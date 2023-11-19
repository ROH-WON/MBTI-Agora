import { Schema, model } from 'mongoose';

const StoryCommentSchema = new Schema(
  {
    storyId: {
      type: Schema.Types.ObjectId,
      ref: 'StoryPost',
      required: true,
    },
    writerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    mood: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'storyComments',
  },
);

const storyComment = model('StoryComment', StoryCommentSchema);

export { storyComment };
