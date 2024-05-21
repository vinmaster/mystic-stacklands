import 'dotenv/config';
import express from 'express';
import basicAuth from 'express-basic-auth';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'colyseus';
import { monitor } from '@colyseus/monitor';
import { playground } from '@colyseus/playground';
import { GameRoom } from './rooms/GameRoom';

const basicAuthMiddleware = basicAuth({
  users: {
    admin: process.env.ADMIN_PASS,
  },
  challenge: true,
});

const PORT = Number(process.env.PORT) || 8000;
const app = express();
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.json());
app.use('/admin', basicAuthMiddleware, monitor());
if (process.env.NODE_ENV !== 'production') {
  app.use('/playground', playground);
}

export const gameServer = new Server({
  server: createServer(app),
});

gameServer.define('GameRoom', GameRoom);

if (process.env.NODE_ENV !== 'test') {
  gameServer.listen(PORT, undefined, undefined, () => {
    console.log(`Server running ${app.get('env')} on port: ${PORT}`);
  });
}
