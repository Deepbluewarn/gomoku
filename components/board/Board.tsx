import { BOARD_SIZE } from '@/app/constants';
import styles from './board.module.css';
import { useSocket } from '../socket-provider';
import { useEffect } from 'react';

export default function Board() {
    const { socket } = useSocket();

    const onCellClick = (cell_num: number) => {
        if(!socket) return;

        socket.emit('place', cell_num);
    }

    useEffect(() => {
        if(!socket) return;
        
        socket?.on('placed', (data) => {
            console.log('[착수 응답] data: ', data);
        });
    }, [socket]);

    const cells = Array(BOARD_SIZE * BOARD_SIZE).fill(null).map((_, idx) => {
        return <div key={idx + 1} className={styles.cell} onClick={() => {onCellClick(idx + 1)}}>{idx + 1}</div>;
    });
    
    return (
        <div className={styles.container}>
            <div className={styles.board}>
                {cells}
            </div>
        </div>
    );
}