'use client'

import { ClientToServerEvents, JOINED, LEAVED, ServerToClientEvents } from "@/interfaces/socket.io";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

type SocketContextType = {
    socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
    status: SocketStatus;
    roomStatus: SocketRoomStatus;
    roomId: SocketRoomId;
};

type SocketStatus = 'disconnected' | 'connected' | 'error';
type SocketRoomStatus = 'joined' | 'leaved' | 'error' | 'not-joined' | 'not-found';
type SocketRoomId = string;

const socketOption = {
    withCredentials: true,
    extraHeaders: {
        'ngrok-skip-browser-warning': '4444'
    }
};

const SocketContext = createContext<SocketContextType>({
    socket: null,
    status: 'disconnected',
    roomStatus: 'not-joined',
    roomId: ''
});

export const useSocket = () => { return useContext(SocketContext) };

export default function SocketProvider({children} : {children: React.ReactNode}) {
    const router = useRouter();
    const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
    const [status, setStatus] = useState<SocketStatus>('disconnected');
    const [roomStatus, setRoomStatus] = useState<SocketRoomStatus>('not-joined');
    const [roomId, setRoomId] = useState<SocketRoomId>('');

    useEffect(() => {
        const socket = io(`wss://${process.env.NEXT_PUBLIC_WEBSOCKET_DOMAIN}`, socketOption);
        
        setSocket(socket);

        socket.on('connected', () => {
            setStatus('connected');
        });

        socket.on('error', () => {
            setStatus('error');
        });

        socket.on(JOINED, (room) => {
            setRoomStatus('joined');
            setRoomId(room.room_id);
        });

        socket.on(LEAVED, () => {
            router.push('/');
            setRoomStatus('leaved');
            setRoomId('');
        })

        return () => {
            socket.disconnect();
        }
    }, []);

    return (
        <SocketContext.Provider value={{
            socket,
            status,
            roomStatus,
            roomId
        }}>
            {children}
        </SocketContext.Provider>
    )
}