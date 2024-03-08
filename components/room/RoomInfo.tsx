'use client'

import { useEffect } from "react";
import { useSocket } from "../socket-provider";
import { JOIN, ROOM_INFO, USER_JOINED, USER_LEAVED, USER_NOT_FOUND } from "@/interfaces/socket.io";
import { useRouter } from "next/navigation";

export default function RoomInfo(props: {roomId: string}) {
    const { socket, status, roomStatus, roomId } = useSocket();
    const router = useRouter();

    useEffect(() => {
        if(!socket) return;

        socket.emit(JOIN, props.roomId);

        socket.on(USER_NOT_FOUND, () => {
            router.push('/');
        });

        socket.on(ROOM_INFO, (room) => {
            console.log(`[RoomInfo] ${ROOM_INFO}: `, room);
        });

        socket.on(USER_JOINED, (user) => {
            console.log(`[RoomInfo] ${USER_JOINED}: `, user)
        });

        socket.on(USER_LEAVED, (user) => {
            console.log(`[RoomInfo] ${USER_LEAVED}: `, user)
        });
    }, [socket]);

    return (
        <>
            {
                roomStatus === 'joined' ? (
                    <h1>Room: {props.roomId}</h1>
                ) : (
                    <h1>Not Joined</h1>
                )
            }
        </>
    )
}
