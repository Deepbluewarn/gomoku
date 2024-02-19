export const BOARD_SIZE = 15;
export const REDIS_SETTING = {
    host: 'localhost',
    port: 5444,
    password: process.env.NEXT_PUBLIC_REDIS_PASSWORD,
    db: 0
}

/** Socket Events */

export const REQUEST_USER_INFO = 'request-user-info';