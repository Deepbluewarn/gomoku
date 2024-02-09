import Board from "@/components/board/Board";
import styles from './page.module.css';

export default function Home() {
  return (

    <main className={styles.main}>
      <div>Header</div>
      <Board />
      <div>Footer</div>
    </main>
  );
}
