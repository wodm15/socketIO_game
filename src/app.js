import express from 'express';
import { createServer } from 'http';
import initSocket from './init/socket.js';
import { loadGameAssets } from './init/assets.js';
import cors from 'cors'; 


const app = express();
const server = createServer(app);

const PORT = 3000;

// CORS 설정 추가
app.use(cors({
  origin: 'http://43.201.83.246:3000', // 허용할 프론트엔드 주소
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // 허용할 HTTP 메소드
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept'] // 허용할 헤더
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));


initSocket(server);

app.get('/', (req, res) => {
  res.send('<h1>Hello World</h1>');
});

// 프론트엔드에서 사용할 JSON 파일의 경로 추가
app.get('/assets', async (req, res) => {
  try {
    const assets = await loadGameAssets();
    res.json(assets);
  } catch (error) {
    console.error('Failed to load game assets:', error);
    res.status(500).json({ error: 'Failed to load game assets' });
  }
});

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);

  try {
    const assets = await loadGameAssets();
    console.log(assets);
    console.log('Assets loaded successfully');
  } catch (error) {
    console.error('Failed to load game assets:', error);
  }

});
