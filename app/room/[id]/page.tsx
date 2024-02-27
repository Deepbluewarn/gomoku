import Board from "@/components/board/Board";
import { getRoom } from "@/actions/room";
import RoomInfo from "@/components/room/RoomInfo";

interface IParams {
    params: { id: string };
}

// 서버 렌더링 단계에서 db 에서 방 정보를 가져온다.
// 방이 존재하지 않으면 404 페이지로 리다이렉트한다.

export default async function Room({params: {id}} : IParams) {
    const room = await getRoom(id);
    
    return (
        <>
            {
                room !== null ? (
                    <>
                        <RoomInfo roomId={id} />
                        {room}
                        <Board room_id={id} />
                    </>
                ) : (
                    <h1>404 Not Found</h1>
                )
            }
        </>
    );
}