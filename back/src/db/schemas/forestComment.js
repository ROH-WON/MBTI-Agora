import { Schema, model } from 'mongoose';

const forestCommentSchema = new Schema(
  {
    forestId: {
      type: Schema.Types.ObjectId,
      ref: 'ForestPost',
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
    collection: 'forestComments',
  },
);

const forestComment = model('forestComment', forestCommentSchema);

export { forestComment };
