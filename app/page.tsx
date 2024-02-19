'use client'

import Board from "@/components/board/Board";
import styles from './page.module.css';
import { useSocket } from "@/components/socket-provider";
import { useEffect, useState } from "react";
import { IUserVerificationStatus } from "@/interfaces/register";
import { REQUEST_USER_INFO } from "./constants";

export default function Home() {
  const { socket } = useSocket();
  const [nickname, setNickname] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [userVerificationStatus, setUserVerificationStatus] = useState<IUserVerificationStatus>({
    nickname: '',
    received: false,
  });

  const processUserSession = async (data: IUserVerificationStatus) => {
    if(!socket) return;

    setUserVerificationStatus({
      nickname: data.nickname,
      received: true,
    })
  }

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

    processUserSession(data.value);
  }

  const requestJoin = async () => {
    if(!socket) return;

    socket.emit('join', joinCode);
  }

  const createRoom = async () => {
    if(!socket) return;

    const res = await fetch(`https://${process.env.NEXT_PUBLIC_API_DOMAIN}/create-room`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '4444',
      },
      credentials: 'include',
    });

    const data = await res.json();

    console.log('createRoom', data.value);
    
    socket.emit('join', data.value.inviteCode);
  }

  useEffect(() => {
    if (!socket) return;

    socket.emit(REQUEST_USER_INFO);

    socket.on(REQUEST_USER_INFO, (data) => {
      console.log(REQUEST_USER_INFO, data);
      processUserSession(data.value);
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
                <input type="text" value={joinCode} onChange={(e) => {setJoinCode(e.target.value)}}/>
                <button onClick={() => { requestJoin() }}>참가하기</button><br />

                <span>또는</span><br />
                <button onClick={() => { createRoom() }}>방 만들기</button>
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
      <Board />
      <div>Footer</div>
    </main>
  );
}
