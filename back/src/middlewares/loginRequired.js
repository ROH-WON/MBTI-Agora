import jwt from 'jsonwebtoken';

function loginRequired(req, res, next) {
  // request 헤더로부터 authorization bearer 토큰을 받음.
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('서비스 사용 요청이 있습니다. Authorization 토큰: 없음');
    res.status(401).send({
      message: '로그인한 유저만 사용할 수 있는 서비스입니다.',
      errorCode: 401,
    });
    return;
  }

  const userToken = authHeader.split(' ')[1];

  // 이 토큰은 jwt 토큰 문자열이거나, 혹은 "null" 문자열임.
  // 토큰이 "null" 일 경우, loginRequired 가 필요한 서비스 사용을 제한함.
  if (userToken === 'null') {
    console.log('서비스 사용 요청이 있습니다.하지만, Authorization 토큰: 없음');
    res.status(401).send({
      message: '로그인한 유저만 사용할 수 있는 서비스입니다.',
      errorCode: 401,
    });
    return;
  }

  // 해당 token 이 정상적인 token인지 확인 -> 토큰에 담긴 userId 정보 추출
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    const jwtDecoded = jwt.verify(userToken, secretKey);
    const userId = jwtDecoded.userId;
    req.currentUserId = userId;
    next();
  } catch (error) {
    res.status(403).send({
      message: '정상적인 토큰이 아닙니다. 다시 한 번 확인해 주세요.',
      errorCode: 403,
    });
    return;
  }
}

export { loginRequired };
