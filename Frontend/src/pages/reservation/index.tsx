import React from 'react';
import Header from '@/components/Header';
import { useSession } from 'next-auth/react';
import Calender from '@/components/Calender';

export default function reservation() {
  // const { data: session, status } = useSession();
  // if (status === 'authenticated') {
  //   //   로그인안되면 홈으로 가게 리다이렉트
  // }
  return (
    <main className="flex flex-col justify-center items-center w-full h-full">
      <Calender />
    </main>
  );
}
