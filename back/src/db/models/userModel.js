import UserModel from '../schemas/user.js';
import AuthModel from '../schemas/authString.js';

class User {
  static async create({ newUser }) {
    const createdNewUser = await UserModel.create(newUser);
    return createdNewUser;
  }

  // 이메일 확인용 랜덤 문자열 저장
  static async createAuthString({ string }) {
    const createdString = await AuthModel.create({ authString: string });
    return createdString;
  }

  // 유저가 입력한 문자열을 db에서 검색
  static async findAuthString({ string }) {
    const insertedString = await AuthModel.findOne({ authString: string });
    return insertedString;
  }

  static async findByEmail({ email }) {
    const user = await UserModel.findOne({ email });
    return user;
  }

  static async findByMbti({ mbti }) {
    const user = await UserModel.find({ mbti });
    return user;
  }

  static async findById({ userId }) {
    const user = await UserModel.findById(userId);
    return user;
  }

  static async findByNickname({ nickname }) {
    const user = await UserModel.findOne({ nickname });
    return user;
  }

  static async findAll() {
    const users = await UserModel.find({});
    return users;
  }

  static async update({ userId, fieldToUpdate, newValue }) {
    const filter = { _id: userId };
    const update = { [fieldToUpdate]: newValue };
    const option = { new: true };

    const updatedUser = await UserModel.findOneAndUpdate(
      filter,
      update,
      option,
    );
    return updatedUser;
  }

  static async delete({ userId }) {
    const user = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { isOut: true, nickname: null },
      { new: true },
    );
    return user;
  }

  // 탈퇴한 회원조회
  static async findDeletedUsers() {
    const users = await UserModel.find({ isOut: true });
    return users;
  }

  static async populateUserImg(user, field) {
    const result = UserModel.populate(user, field);
    return result;
  }
}

export default User;
