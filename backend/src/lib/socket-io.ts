import express, { Express } from "express";
import http from 'http';
import { Server, Socket } from "socket.io";
import { User } from "../models/user.model";
import { Captain } from "../models/captain.model";

const app: Express = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    }
});

interface SocketUser {
    userId: string;
    userType: 'user' | 'captain';
}

const socketUserMap: Record<string, SocketUser> = {};
const userSocketMap: Record<string, string> = {};
const captainSocketMap: Record<string, string> = {};

io.on('connection', (socket: Socket) => {

    socket.on('join', async (data: { userId: string; userType: 'user' | 'captain' }) => {
        try {
            const { userId, userType } = data;
            console.log("this is the data",data)

            if (!userId || (userType !== 'user' && userType !== 'captain')) {
                console.error('Invalid join data:', data);
                return;
            }

            socketUserMap[socket.id] = { userId, userType };

            if (userType === 'user') {
                await User.findByIdAndUpdate(userId, { socketId: socket.id });
                userSocketMap[userId] = socket.id;
            } else if (userType === 'captain') {
                await Captain.findByIdAndUpdate(userId, { socketId: socket.id });
                captainSocketMap[userId] = socket.id;
            }

            console.log(`User ${userId} (${userType}) connected with socket ID ${socket.id}`);
        } catch (error) {
            console.error('Error in join handler:', error);
        }
    });

    socket.on('disconnect', async () => {
        try {
            console.log("User disconnected", socket.id);
            const userInfo = socketUserMap[socket.id];

            if (userInfo) {
                const { userId, userType } = userInfo;

                if (userType === 'user') {
                    await User.findByIdAndUpdate(userId, { $unset: { socketId: 1 } });
                    delete userSocketMap[userId];
                } else if (userType === 'captain') {
                    await Captain.findByIdAndUpdate(userId, { $unset: { socketId: 1 } });
                    delete captainSocketMap[userId];
                }

                delete socketUserMap[socket.id];
                console.log(`Cleaned up resources for ${userId} (${userType})`);
            }
        } catch (error) {
            console.error('Error in disconnect handler:', error);
        }
    });
});

export function getUserSocketId(userId: string): string | undefined {
    return userSocketMap[userId];
}

export function getCaptainSocketId(userId: string): string | undefined {
    return captainSocketMap[userId];
}

export function getAllCaptainSocketIds(): string[] {
    return Object.values(captainSocketMap);
}

export function getAllUserSocketIds(): string[] {
    return Object.values(userSocketMap);
}

export { app, io, server };