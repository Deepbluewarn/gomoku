'use client'

import { IRoom } from "@/interfaces/room";
import { ClientToServerEvents, JOINED, LEAVED, GAME_INFO, ServerToClientEvents, TURN, USER_JOINED, USER_LEAVED, USER_NOT_FOUND, GAME_STARTED, GAME_END, Stone, GameStatus } from "@/interfaces/socket.io";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Server } from "socket.io";
import { Socket, io } from "socket.io-client";

export type IO = Server<ServerToClientEvents, ClientToServerEvents>;
export type SOCKET = Socket<ServerToClientEvents, ClientToServerEvents>;
export type UserList = Map<string, User>;

interface User {
    status: 'online' | 'offline';
    nickname: string;
}
type SocketContextType = {
    socket: SOCKET | null;
    socketStatus: SocketStatus;
    roomStatus: SocketRoomStatus;
    gameStatus: GameStatus;
    roomId: SocketRoomId;
    userList: UserList;
    roomInfo: IRoom | null;
    turn: boolean;
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
    socketStatus: 'disconnected',
    roomStatus: 'not-joined',
    gameStatus: 'waiting',
    roomId: '',
    userList: new Map(),
    roomInfo: null,
    turn: false
});

export const useSocket = () => { return useContext(SocketContext) };

export default function SocketProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [socket, setSocket] = useState<SOCKET | null>(null);
    const [socketStatus, setSocketStatus] = useState<SocketStatus>('disconnected');
    const [roomStatus, setRoomStatus] = useState<SocketRoomStatus>('not-joined');
    const [gameStatus, setGameStatus] = useState<GameStatus>('waiting');
    const [roomId, setRoomId] = useState<SocketRoomId>('');
    const [userList, setUserList] = useState<UserList>(new Map());
    const [turn, setTurn] = useState<boolean>(false);

    // roomInfo 는 게임의 초기 상태만을 나타낸다. 게임의 진행 상황은 다른 상태로 관리한다.
    const [roomInfo, setRoomInfo] = useState<IRoom | null>(null);

    useEffect(() => {
        const socket: SOCKET = io(`wss://${process.env.NEXT_PUBLIC_WEBSOCKET_DOMAIN}`, socketOption);

        setSocket(socket);

        socket.on('connect', () => {
            setSocketStatus('connected');
        });

        socket.on('connect_error', () => {
            setSocketStatus('error');
        });

        socket.on(JOINED, (room) => {
            setRoomStatus('joined');
            setRoomId(room.room_id);
        });

        socket.on(LEAVED, () => {
            router.push('/');
            setRoomStatus('leaved');
            setRoomId('');
        });

        socket.on(USER_NOT_FOUND, () => {
            router.push('/');
        });

        socket.on(GAME_INFO, (room) => {
            console.log(`[GAME_INFO] ${GAME_INFO}: `, room);

            setUserList(new Map(room.players?.map(user => [user.id, {
                status: 'online',
                nickname: user.nickname
            }])));
            setRoomInfo({
                room_id: room.room_id,
                players: room.players,
                owner: room.owner,
                board: room.board,
                black: room.black,
                status: room.status
            });
            setGameStatus(room.status);
            setTurn(room.turn);
        });

        socket.on(GAME_STARTED, () => {
            console.log('game started');
            setGameStatus('playing');
        });

        socket.on(GAME_END, () => {
            console.log('game end');
            setGameStatus('end');
        });

        socket.on(USER_JOINED, (user) => {
            console.log(`[RoomInfo] ${USER_JOINED}: `, user)

            setUserList((prev) => {
                const newMap = new Map(prev);
                newMap.set(user.id, {
                    status: 'online',
                    nickname: user.nickname
                });
                return newMap;
            });
        });

        socket.on(USER_LEAVED, (user) => {
            console.log(`[RoomInfo] ${USER_LEAVED}: `, user)

            setUserList((prev) => {
                const newMap = new Map(prev);
                newMap.set(user.id, {
                    status: 'offline',
                    nickname: user.nickname
                });
                return newMap;
            });
        });

        return () => {
            socket.disconnect();
        }
    }, []);

    useEffect(() => {
        if(!socket) return;

        socket.on(TURN, data => {
            console.log(`[RoomInfo] ${TURN}: `, data, roomInfo?.black);
            if (!roomInfo) return;
            
            const stoneColor: Stone = roomInfo.black ? 'black' : 'white';

            setTurn(stoneColor === data);
        })
    }, [socket, roomInfo]);

    return (
        <SocketContext.Provider value={{
            socket,
            socketStatus,
            roomStatus,
            gameStatus,
            roomId,
            userList,
            roomInfo,
            turn
        }}>
            {children}
        </SocketContext.Provider>
    )
}