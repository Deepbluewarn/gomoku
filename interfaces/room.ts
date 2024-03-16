import { IStone } from "./game";
import { GameStatus, IUserSession } from "./socket.io";

export interface IRoom {
    room_id: string;
    players: IUserSession[];
    owner: IUserSession;
    board: IStone[];
    black: boolean;
    status: GameStatus;
}