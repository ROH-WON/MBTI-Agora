import { image } from '../schemas/image.js';

class imageModel {
  static async create({ newImage }) {
    const createdImage = await image.create(newImage);
    return createdImage;
  }

  static async findOneByImageId({ imageId }) {
    const findedImage = await image.findOne({ _id: imageId });
    return findedImage;
  }

  static async deleteImage({ imageId }) {
    await image.findByIdAndDelete({ _id: imageId });
    return;
  }
}

export { imageModel };
