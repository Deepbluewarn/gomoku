'use client'

import React, { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

type SocketContextType = {
    socket: Socket | null;
};

const socketOption = {
    withCredentials: true,
    extraHeaders: {
        'ngrok-skip-browser-warning': '4444'
    }
};

const SocketContext = createContext<SocketContextType>({
    socket: null
});

export const useSocket = () => { return useContext(SocketContext) };

export default function SocketProvider({children} : {children: React.ReactNode}) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const socket = io(`wss://${process.env.NEXT_PUBLIC_WEBSOCKET_DOMAIN}`, socketOption);
        
        setSocket(socket);

        socket.on('connected', () => {

        });

        return () => {
            socket.disconnect();
        }
    }, []);

    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    )
}