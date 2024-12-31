import { Server } from 'socket.io';
import { createServer } from 'http';
import express from 'express';
import { log } from '@/utils/logs';

const app = express();
const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

export function getReceiverSocketId(userId: string) {
    return userSocketMap[userId];
}

const userSocketMap: { [key: string]: string } = {};

io.on('connection', (socket) => {
    log(`🔗 a user connected ${socket.id}`, 'info', __filename);

    const userId = socket.handshake.query.userId as string;
    userSocketMap[userId] = socket.id;

    io.emit('getOnlineUsers', Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        log(`🔗 a user disconnected ${socket.id}`, 'info', __filename);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { app, server, io };
