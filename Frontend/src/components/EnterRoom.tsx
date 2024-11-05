// import './Main.css';
import MyContext from '@/context/Mycontext';
import React, { useContext, useRef, useState } from 'react';

export default function EnterRoom() {
  const { roomName, hidden, setHidden } = useContext(MyContext);
  const inputRef = useRef<HTMLInputElement>(null); // inputRef의 타입을 명시해주어야 합니다.

  function SubmitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inputRef.current) {
      roomName.current = inputRef.current.value;
    }
    setHidden(!hidden);
  }

  return (
    <div hidden={hidden}>
      <form id="welcome" onSubmit={SubmitHandler}>
        <input ref={inputRef} placeholder="이름을 입력해주세요" required type="text" />
        <button>입장</button>
      </form>
    </div>
  );
}
