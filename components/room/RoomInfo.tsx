'use client'

import { useEffect } from "react";
import { useSocket } from "../socket-provider";
import { JOIN } from "@/interfaces/socket.io";
import { useRouter } from "next/navigation";

export default function RoomInfo(props: { roomId: string }) {
    const { socket, roomStatus, gameStatus, userList, turn } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.emit(JOIN, props.roomId);
    }, [socket]);

    return (
        <>
            {
                roomStatus === 'joined' ? (
                    <>
                        <h1>Room: {props.roomId}</h1>
                        {
                            Array.from(userList).map(user => {
                                return (
                                    <h2 key={user[0]}>{user[1].nickname} ({user[1].status})</h2>
                                )
                            })
                        }
                        <h2>Turn: {turn ? 'True' : 'False'}</h2>
                        <h2>GameStatus: {gameStatus}</h2>
                    </>

                ) : (
                    <h1>Not Joined</h1>
                )
            }
        </>
    )
}
