import { BOARD_SIZE } from '@/app/constants';
import styles from './board.module.css';

export default function Board() {
    const cells = Array(BOARD_SIZE * BOARD_SIZE).fill(null).map((_, idx) => {
        return <div key={idx} className={styles.cell} />;
    });
    
    return (
        <div className={styles.container}>
            <div className={styles.board}>
                {cells}
            </div>
        </div>
    );
}