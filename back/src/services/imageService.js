import fs from 'fs';
import { UPLOAD_PATH } from '../utills/path.js';
import { imageModel } from '../db/models/imageModel.js';
import { storyPostModel } from '../db/models/storyPostModel.js';
import { saveS3, deleteS3 } from '../utills/multer.js';

class imageService {
  static async generateUniqueFileName(file) {
    const uniqueSuffix = `${Date.now()}`;
    const extension = file.originalname.split('.').pop(); // 확장자 추출
    const fileName = `formData-${uniqueSuffix}.${extension}`;
    return fileName;
  }

  static async uploadImage({ file }) {
    if (!file) {
      throw new Error('No image file uploaded.');
    }
    const fileName = file.filename;
    const filePath = `${UPLOAD_PATH}/${fileName}`;

    const newImage = { fileName: fileName, path: filePath };
    const createImage = await imageModel.create({ newImage });
    return createImage;
  }

  static async uploadStableImage(imageData) {
    const uniqueSuffix = `${Date.now()}`;
    const fileName = `stable-${uniqueSuffix}.png`;
    const filePath = `${UPLOAD_PATH}/${fileName}`;
    fs.writeFileSync(filePath, imageData);
    const newImage = {
      fileName: fileName,
      path: filePath,
    };
    const createImage = await imageModel.create({ newImage });
    return createImage;
  }

  static async uploadImageInS3({ file }) {
    if (!file) {
      throw new Error('No image file uploaded.');
    }

    const fileName = file.key; // original/formData-1691049514760.jpg
    const filePath = file.location; // https://damchae.s3.ap-northeast-2.amazonaws.com/original/formData-1691049514760.jpg

    const newImage = { fileName: fileName, path: filePath };
    const createdImage = await imageModel.create({ newImage });

    return createdImage;
  }

  static async uploadStableImageInS3(imageData) {
    const uniqueSuffix = `${Date.now()}`;
    const key = `test/stable-${uniqueSuffix}.jpg`;
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: imageData,
      ContentType: 'image/jpeg',
      ACL: 'public-read', // 이미지를 public으로 설정
    };

    await saveS3(uploadParams);
    const filePath = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${key}`;

    const newImage = {
      fileName: key,
      path: filePath,
    };
    const createImage = await imageModel.create({ newImage });
    return createImage;
  }

  static async deleteStoryImageInS3({ storyId }) {
    const story = await storyPostModel.findOneByStoryId({ storyId });
    const image = await imageModel.findOneByImageId({
      imageId: story.thumbnail,
    });
    if (image) {
      await imageModel.deleteImage({ imageId: story.thumbnail }); // DB 데이터 삭제
      const fileName = image.fileName;
      const deleteParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileName,
      };
      await deleteS3(deleteParams); // S3 이미지 삭제
    }
    return;
  }
}

export { imageService };
