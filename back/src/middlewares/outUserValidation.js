import { userService } from '../services/userService.js';

// isOut 필드가 false인 유저만 서비스 이용가능
async function outUserValidation(req, res, next) {
  try {
    const email = req.body.email;
    const isOut = await userService.isDeletedUser({ email });

    if (isOut === null) {
      // 404 : 요청받은 리소스 찾을 수 없음
      return res
        .status(404)
        .json({ error: '해당 이메일 주소와 일치하는 유저가 없습니다.' });
    } else if (isOut === true) {
      // 403 : 권한 없음
      return res
        .status(403)
        .json({ error: '해당 유저는 서비스 이용이 불가능한 상태입니다.' });
    }
    next();
  } catch (error) {
    next(error);
  }
}

export { outUserValidation };
