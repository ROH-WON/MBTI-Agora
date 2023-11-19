import { Schema, model } from 'mongoose';

const storyRandomPhraseSchema = new Schema({
  mood: {
    type: String,
    required: true,
  },
  phrase: {
    type: String,
    required: true,
  },
});

const storyRandomPhrase = model(
  'StoryRandomPhrase',
  storyRandomPhraseSchema,
  'storyRandomPhrases',
);

export { storyRandomPhrase };
