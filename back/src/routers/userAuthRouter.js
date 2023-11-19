import { Router } from 'express';
import { userAuthController } from '../controllers/userController.js';
import { loginRequired } from '../middlewares/loginRequired.js';
import { outUserValidation } from '../middlewares/outUserValidation.js';
import { uploadS3 } from '../utills/multer.js';

const userAuthRouter = Router();

userAuthRouter.post(
  '/register',
  uploadS3.single('profileImg'),
  userAuthController.registerUser,
);

userAuthRouter.post('/googleRegister', userAuthController.googleRegister);

userAuthRouter.post('/login', outUserValidation, userAuthController.userLogin);

userAuthRouter.post(
  '/googleLogin',
  outUserValidation,
  userAuthController.googleLogin,
);

userAuthRouter.put(
  '/update',
  loginRequired,
  uploadS3.single('profileImg'),
  userAuthController.updateUser,
);

userAuthRouter.get('/checkNickname', userAuthController.checkNickname);

userAuthRouter.put('/out', loginRequired, userAuthController.deleteUser);

userAuthRouter.post('/sendEmailCode', userAuthController.sendAuthCode);

userAuthRouter.post('/checkEmailCode', userAuthController.validateString);

export { userAuthRouter };
