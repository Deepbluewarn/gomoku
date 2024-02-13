'use client'

import Board from "@/components/board/Board";
import styles from './page.module.css';
import { useSocket } from "@/components/socket-provider";
import { useEffect, useState } from "react";

export default function Home() {
  const { socket } = useSocket();
  const [nickname, setNickname] = useState(''); // TODO: 닉네임 입력 필드 구현

  const requestRegister = async () => {
    await fetch(`https://${process.env.NEXT_PUBLIC_API_DOMAIN}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '4444',
      },
      credentials: 'include',
      body: JSON.stringify({ nickname }),
    });
  }

  useEffect(() => {
    if (typeof socket === 'undefined') return;
  }, [socket])

  return (
    <main className={styles.main}>
      <div>Header</div>
      <div>
        <input type="text" value={nickname} onChange={(e) => {setNickname(e.target.value)}}/>
        <button onClick={() => { requestRegister() }}>가입하기</button>
      </div>
      {/* <Board /> */}
      <div>Footer</div>
    </main>
  );
}
