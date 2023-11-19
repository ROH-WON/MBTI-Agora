import * as url from 'url';
import path from 'path';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { fileSize } from './constant.js';
import { UPLOAD_PATH, S3_FOLDER_PATH } from './path.js';
import { imageService } from '../services/imageService.js';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

export const upload = multer({
  storage: multer.diskStorage({
    async filename(req, file, done) {
      try {
        const uniqueFileName = await imageService.generateUniqueFileName(file);
        done(null, uniqueFileName);
      } catch (error) {
        done(null, error);
      }
    },

    destination(req, file, done) {
      const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
      const destinationPath = path.join(__dirname, `../../${UPLOAD_PATH}`);
      done(null, destinationPath);
    },
  }),
  fileFilter(req, file, done) {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/bmp',
      'image/gif',
      'image/jpg',
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type');
    }
    done(null, true);
  },
  limits: { fileSize: fileSize },
});

export const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  region: process.env.S3_REGION,
});

export const uploadS3 = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read', // 이미지를 public으로 설정
    contentDisposition: 'inline', // 브라우저 상에서 이미지 바로 띄우기
    contentType: multerS3.AUTO_CONTENT_TYPE,
    async key(req, file, done) {
      try {
        const uniqueFileName = await imageService.generateUniqueFileName(file);
        const fullNameKey = `${S3_FOLDER_PATH}/${uniqueFileName}`;
        done(null, fullNameKey);
      } catch (error) {
        done(null, error);
      }
    },
  }),
  fileFilter(req, file, done) {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/bmp',
      'image/gif',
      'image/jpg',
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type');
    }
    done(null, true);
  },
  limits: { fileSize: fileSize },
});

export async function saveS3(uploadParams) {
  const uploadCommand = new PutObjectCommand(uploadParams);
  await s3.send(uploadCommand);
}

export async function deleteS3(deleteParams) {
  try {
    if (!deleteParams) {
      console.log('No image In S3');
    }
    const deleteCommand = new DeleteObjectCommand(deleteParams);
    await s3.send(deleteCommand);
    console.log('Image deleted successfully');
  } catch (error) {
    console.error('Error deleting image');
  }
}
