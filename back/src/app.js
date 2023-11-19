import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { router } from './routers/index.js';

const app = express();
app.use('/uploads', express.static('uploads'));

app.use(cors());

app.use(morgan('dev'));
// 콘솔창에서 log 확인

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 기본 페이지
app.get('/', (req, res) => {
  res.send('안녕하세요, 레이서 프로젝트 API 입니다.');
});
app.use('/api', router);
app.use(errorMiddleware);

export { app };
