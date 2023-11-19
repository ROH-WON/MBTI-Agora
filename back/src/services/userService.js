import User from '../db/models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { generateRandomString } from '../utills/emailAuth.js';
import smtpTransport from '../utills/emailAuth.js';

class userService {
  static async createUser({
    profileImg,
    mbtiImg,
    email,
    password,
    mbti,
    nickname,
    isGoogleLogin,
  }) {
    // 이메일 중복 확인
    const user = await User.findByEmail({ email });
    if (user) {
      const errorMessage =
        '이 이메일은 현재 사용중입니다. 다른 이메일을 입력해 주세요.';
      return { errorMessage };
    }

    let hashedPassword;

    // 비밀번호 해쉬화 (비밀번호가 제공된 경우에만 수행)
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newUser = {
      profileImg,
      mbtiImg,
      email,
      password: isGoogleLogin ? password : hashedPassword,
      mbti,
      nickname,
      isGoogleLogin: isGoogleLogin || false, // isGoogleLogin 값을 포함하거나 기본값으로 false 설정
    };

    // db에 저장
    const createdNewUser = await User.create({ newUser });
    return createdNewUser;
  }

  // 이메일 인증코드 전송
  static async sendAuthEmail({ email }) {
    // 이메일 중복확인
    const isDuplicated = await User.findByEmail({ email });
    if (isDuplicated) {
      const state = 'Duplicated User';
      const message = '이미 가입내역이 존재하는 이메일입니다.';
      return { state, message };
    }

    // 인증코드 생성
    const string = generateRandomString(10);
    const createdString = await User.createAuthString({ string });
    const emailString = createdString.authString;

    const mailOptions = {
      from: '담채',
      to: email,
      subject: '[담채] 이메일 확인 인증코드 안내',
      text: `인증요청 이메일 [${email}] \n
            아래 코드를 인증코드란에 입력해주세요.\n
            인증코드: ${emailString}\n
            해당 코드는 3분 후에 만료됩니다.`,
    };

    // 전송
    try {
      await smtpTransport.sendMail(mailOptions);

      const state = 'Success';
      const message = `${email}로 보내는 인증메일 전송에 성공했습니다.`;
      return { state, message };
    } catch (error) {
      const state = 'Fail';
      const message = `${email}로 보내는 인증메일 전송에 실패하였습니다.`;
      return { state, message };
    }
  }

  // 이메일 인증코드 확인
  static async readAuthString({ string }) {
    const searchString = await User.findAuthString({ string });
    if (searchString === null) {
      return null;
    }
    const resultString = searchString.authString;
    return resultString;
  }

  static async readUser({ email, password }) {
    // 이메일 db에 존재 여부 확인
    const user = await User.findByEmail({ email });
    if (!user) {
      const errorMessage =
        '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.';
      return { errorMessage };
    }

    let isPasswordCorrect = false;
    if (user.isGoogleLogin) {
      const errorMessage = 'Google 계정으로 로그인해 주세요.';
      return { errorMessage };
    } else {
      // 비밀번호 일치 여부 확인
      const correctPasswordHash = user.password;
      isPasswordCorrect = await bcrypt.compare(password, correctPasswordHash);
    }

    if (!isPasswordCorrect) {
      const errorMessage =
        '비밀번호가 일치하지 않습니다. 다시 한 번 확인해 주세요.';
      return { errorMessage };
    }

    // 로그인 성공 -> JWT 웹 토큰 생성
    const secretKey = process.env.JWT_SECRET_KEY || 'jwt-secret-key';
    const token = jwt.sign({ userId: user.id }, secretKey);

    // 반환할 loginUser 객체를 위한 변수 설정
    const { id, mbti, nickname, isGoogleLogin, mbtiImg, profileImg, isOut } =
      user;

    const loginUser = {
      token,
      id,
      email,
      mbti,
      nickname,
      isGoogleLogin,
      mbtiImg,
      profileImg,
      isOut,
      errorMessage: null,
    };

    return loginUser;
  }

  static async readUsers() {
    const users = await User.findAll();
    return users;
  }

  static async updateUser({ userId, toUpdate }) {
    let user = await User.findById({ userId });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      const errorMessage = '가입 내역이 없습니다. 다시 한 번 확인해 주세요.';
      return { errorMessage };
    }

    if (toUpdate.nickname) {
      const fieldToUpdate = 'nickname';
      const newValue = toUpdate.nickname;
      user = await User.update({ userId, fieldToUpdate, newValue });
    }

    if (toUpdate.password) {
      const fieldToUpdate = 'password';
      const newValue = await bcrypt.hash(toUpdate.password, 10);
      user = await User.update({ userId, fieldToUpdate, newValue });
    }

    if (toUpdate.mbti) {
      const fieldToUpdate = 'mbti';
      const newValue = toUpdate.mbti;
      user = await User.update({ userId, fieldToUpdate, newValue });
    }

    if (toUpdate.profileImg && toUpdate.mbtiImg == null) {
      const fieldToUpdate = 'profileImg';
      const newValue = toUpdate.profileImg;
      user = await User.update({
        userId,
        fieldToUpdate: 'mbtiImg',
        newValue: null,
      });
      user = await User.update({ userId, fieldToUpdate, newValue });
    }

    if (toUpdate.mbtiImg && toUpdate.profileImg == null) {
      const fieldToUpdate = 'mbtiImg';
      const newValue = toUpdate.mbtiImg;
      user = await User.update({
        userId,
        fieldToUpdate: 'profileImg',
        newValue: null,
      });
      user = await User.update({ userId, fieldToUpdate, newValue });
    }

    return user;
  }

  static async readUserInfo({ userId }) {
    const user = await User.findById({ userId });

    // db에서 찾지 못한 경우, 에러 메시지 반환
    if (!user) {
      const errorMessage =
        '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.';
      return { errorMessage };
    }

    return user;
  }

  static async readUserEmail({ email }) {
    const user = await User.findByEmail({ email });
    return user;
  }

  static async readUserNickname({ nickname }) {
    const user = await User.findByNickname({ nickname });

    if (!user) {
      const nicknameState = 'usableNickname';
      const usableNickname = '사용 가능한 닉네임 입니다.';
      return { nicknameState, usableNickname };
    }
    const nicknameState = 'unusableNickname';
    const unusableNickname = '이미 사용 중인 닉네임 입니다.';
    return { nicknameState, unusableNickname };
  }

  // 회원탈퇴 : 회원 정보는 그대로 남아있음
  static async deleteUser({ userId }) {
    const user = await User.delete({ userId });
    return user;
  }

  static async isDeletedUser({ email }) {
    const user = await User.findByEmail({ email });
    if (!user) {
      const errorState = 'error';
      const errorMessage = '가입 내역이 없는 이메일 입니다.';
      return { errorState, errorMessage };
    }
    const isOut = user.isOut;
    return isOut;
  }

  //구글 로그인용
  static async readGoogleUser({ email, idToken }) {
    const user = await User.findByEmail({ email });
    if (!user) {
      const errorMessage =
        '해당 이메일은 가입 내역이 없습니다. 다시 한 번 확인해 주세요.';
      return { errorMessage };
    }

    if (!user.isGoogleLogin) {
      const errorMessage =
        '일반 로그인으로 진행하세요. 이미 이 주소로 일반 회원가입을 진행하였습니다.';
      return { errorMessage };
    }

    const verifyIdToken = async (token) => {
      const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

      const getClient = () => {
        return new OAuth2Client(CLIENT_ID);
      };

      const client = getClient();
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      return payload;
    };

    const payload = await verifyIdToken(idToken);
    if (!payload || payload.email !== email) {
      const errorMessage = 'Google 인증에 실패했습니다.';
      return { errorMessage };
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ userId: user.id }, secretKey);
    const { id, mbti, nickname, isOut, profileImg, mbtiImg } = user;

    const loginUser = {
      token,
      id,
      email,
      mbti,
      profileImg,
      mbtiImg,
      nickname,
      isOut,
      errorMessage: null,
    };

    return loginUser;
  }

  static async populateUserProfile(user, options) {
    const { path, select } = options;
    const field = { path: path, select: select };
    const result = await User.populateUserImg(user, field);
    return result;
  }
}

export { userService };
