'use client'

import Board from "@/components/board/Board";
import styles from './page.module.css';
import { useSocket } from "@/components/socket-provider";
import { useEffect } from "react";

export default function Home() {
  const { socket } = useSocket();

  useEffect(() => {
    if(typeof socket === 'undefined') return;

    socket?.emit('client', '안녕하세요');
  }, [socket])

  return (
    <main className={styles.main}>
      <div>Header</div>
      <Board />
      <div>Footer</div>
    </main>
  );
}
