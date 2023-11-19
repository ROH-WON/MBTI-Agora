import 'dotenv/config';
import { app } from './src/app.js';
import mongoose from 'mongoose';
import { ALTERNATIVE_SERVER_PORT } from './src/utills/constant.js';

const PORT = process.env.SERVER_PORT || ALTERNATIVE_SERVER_PORT;
const DB_URL = process.env.MONGODB_URL || process.env.MONGODB_ALTERNATIVE_URL;

mongoose.connect(DB_URL);

const db = mongoose.connection;

// 연결 성공 시 이벤트 처리
db.on('connected', () => {
  console.log('MongoDB와 연결되었습니다.');
});

// 연결 실패 시 이벤트 처리
db.on('error', (error) => {
  console.error('MongoDB 연결 에러:', error);
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`정상적으로 서버를 시작하였습니다. http://localhost:${PORT}`);
});
