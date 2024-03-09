'use client'

import { BOARD_SIZE } from '@/app/constants';
import styles from './board.module.css';
import { useSocket } from '../socket-provider';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { PLACE, PLACED } from '@/interfaces/socket.io';

type StoneType = 'none' | 'black' | 'white';

export default function Board(props: {roomId: string}) {
    const { socket, status, roomStatus, roomId } = useSocket();
    const [board, setBoard] = useState<StoneType[][]>(Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill('none')));

    const onCellClick = (cell_num: number) => {
        if (!socket) return;

        socket.emit(PLACE, {
            room_id: props.roomId,
            cell_num
        });
    }

    useEffect(() => {
        if (!socket) return;

        socket.on(PLACED, (data) => {
            console.log('placed: ', data);
            place(data.cell_num, 'white');
        });
    }, [socket]);

    const place = useCallback((cell_num: number, stoneType: StoneType) => {
        let i = Math.trunc(cell_num / BOARD_SIZE);
        let j = cell_num % BOARD_SIZE - 1;

        if(cell_num % BOARD_SIZE === 0) {
            i = --i;
            j = BOARD_SIZE - 1;
        }

        setBoard((prev) => {
            const newBoard = prev.map(arr => [...arr]);
            
            newBoard[i][j] = stoneType;
            return newBoard;
        });
    }, []);

    const lines = Array(BOARD_SIZE + 1).fill(null).map((_, idx) => {
        const x = (idx + 1) * ((100 / (BOARD_SIZE + 1)));

        return (
            (idx === BOARD_SIZE) ? (
                null
            ) : (
                <Fragment key={x}>
                    <line key={`${'v'}-${x}`} x1={`${x}%`} y1="0%" x2={`${x}%`} y2="100%" stroke="black" strokeWidth={2} />
                    <line key={`${'h'}-${x}`} x1="0%" y1={`${x}%`} x2="100%" y2={`${x}%`} stroke="black" strokeWidth={2} />
                </Fragment>
            )

        );
    });

    const cellStyle = styles['cell'];
    const stoneBlackStyle = styles['cell-black-stone'];
    const stoneWhiteStyle = styles['cell-white-stone'];
    const distance = 100 / (BOARD_SIZE + 1);
    const stones: JSX.Element[] = [];

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            const cell = board[i][j];
            const stoneStyle = cell === 'black' ? stoneBlackStyle : cell === 'white' ? stoneWhiteStyle : cellStyle;
            
            stones.push(
                <circle
                    key={`${cell}-${i}-${j}`}
                    cx={`${((j + 1) * distance)}%`}
                    cy={`${((i + 1) * distance)}%`}
                    r="2.4%"
                    className={`${stoneStyle}`}
                    onClick={() => onCellClick(i * BOARD_SIZE + j + 1)}
                />
            )
        }
    }

    return (
        <>
            {
                roomStatus === 'joined' ? (
                    <div className={styles.container}>
                        <div className={styles['board-inner']}>
                            <div className={styles['line-container']}>
                                <svg>
                                    {lines}
                                    {stones}
                                </svg>
                            </div>
                        </div>
                    </div>
                ) : (
                    <h1>Not Joined</h1>
                )
            }
        </>
    );
}