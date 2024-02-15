'use client'

import Board from "@/components/board/Board";
import styles from './page.module.css';
import { useSocket } from "@/components/socket-provider";
import { useEffect, useState } from "react";
import { IUserVerificationStatus } from "@/interfaces/register";

export default function Home() {
  const { socket } = useSocket();
  const [nickname, setNickname] = useState('');
  const [userVerificationStatus, setUserVerificationStatus] = useState<IUserVerificationStatus>({
    nickname: '',
    inviteCode: '',
    received: false,
  });

  const requestRegister = async () => {
    const res = await fetch(`https://${process.env.NEXT_PUBLIC_API_DOMAIN}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '4444',
      },
      credentials: 'include',
      body: JSON.stringify({ nickname }),
    });

    const data = await res.json();

    setUserVerificationStatus({
      nickname: data.value.nickname,
      inviteCode: data.value.inviteCode,
      received: true,
    })
  }

  useEffect(() => {
    if (!socket) return;

    socket.emit('register');

    socket.on('register', (data) => {
      setUserVerificationStatus({
        nickname: data.value.nickname,
        inviteCode: data.value.inviteCode,
        received: true,
      });
    });
  }, [socket])

  return (
    <main className={styles.main}>
      <div>Header</div>

      <div>
        {
          userVerificationStatus.received ? (
            userVerificationStatus.nickname !== '' ? (
              <div>
                <span>안녕하세요, {userVerificationStatus.nickname}님</span><br />
                <span>초대 코드: {userVerificationStatus.inviteCode}</span>
              </div>
            ) : (
              <div>
                <input type="text" value={nickname} onChange={(e) => {setNickname(e.target.value)}}/>
                <button onClick={() => { requestRegister() }}>가입하기</button>
              </div>
            )
          ) : (
            <span>서버 연결 중..</span>
          )
        }
      </div>
      {/* <Board /> */}
      <div>Footer</div>
    </main>
  );
}
