import Board from "@/components/board/Board";
import RoomInfo from "@/components/room/RoomInfo";

interface IParams {
    params: { id: string };
}

export default async function Room({params: {id}} : IParams) {
    return (
        <>
            <RoomInfo roomId={id} />
            <Board roomId={id} />
        </>
    );
}