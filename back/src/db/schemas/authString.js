import { Schema, model } from 'mongoose';

const AuthSchema = new Schema(
  {
    authString: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'emailCode',
  },
);

const AuthModel = model('Auth', AuthSchema);

export default AuthModel;
