'use client'

import { useEffect } from "react";
import { useSocket } from "../socket-provider";
import { JOIN, ROOM_INFO, USER_NOT_FOUND } from "@/interfaces/socket.io";
import { useRouter } from "next/navigation";

export default function RoomInfo(props: {roomId: string}) {
    const { socket } = useSocket();
    const router = useRouter();

    useEffect(() => {
        if(!socket) return;

        socket.emit(JOIN, props.roomId);

        socket.on(USER_NOT_FOUND, () => {
            router.push('/');
        });

        socket.on(ROOM_INFO, (room) => {
            console.log(`${ROOM_INFO}: `, room);
        });
    }, [socket]);

    return (
        <div>
            <h1>Room: {props.roomId}</h1>
        </div>
    )
}
