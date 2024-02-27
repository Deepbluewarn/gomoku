'use server'

import { REDIS_SETTING } from "@/app/constants";
import { Redis } from "ioredis";

const redis = new Redis(REDIS_SETTING);

export async function getRoom(roomId: string) {
    const room = await redis.hget('room', roomId);

    console.log(roomId)
    return room;
}
