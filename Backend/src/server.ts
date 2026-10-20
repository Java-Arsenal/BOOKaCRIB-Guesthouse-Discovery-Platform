import 'dotenv/config';
import cors from 'cors'; // <-- 1. Import cors
import app from './app';

// 2. Enable CORS so your frontend at localhost:5173 can talk to your backend
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

const port = process.env.PORT ?? 5000;
app.listen(port, () => console.log(`API running on port ${port}`));