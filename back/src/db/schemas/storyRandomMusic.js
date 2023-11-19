import { Schema, model } from 'mongoose';

const storyRandomMusicSchema = new Schema({
  mood: {
    type: String,
    required: true,
  },
  music: {
    type: String,
    required: true,
  },
});

const storyRandomMusic = model(
  'StoryRandomMusic',
  storyRandomMusicSchema,
  'storyRandomMusics',
);

export { storyRandomMusic };
