import { GameStatus, IUserSession } from "./socket.io";

export interface IRoom {
    room_id: string;
    players: IUserSession[];
    owner: IUserSession;
    board: number[][];
    black: boolean;
    status: GameStatus;
}