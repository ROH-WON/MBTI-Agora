import { Schema, model } from 'mongoose';

const UserSchema = new Schema(
  {
    profileImg: {
      type: Schema.Types.ObjectId,
      ref: 'Image',
      required: false,
    },
    mbtiImg: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    mbti: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
      unique: true,
    },
    isOut: {
      type: Boolean,
      required: true,
      default: false,
    },
    isGoogleLogin: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

const UserModel = model('User', UserSchema);

export default UserModel;
