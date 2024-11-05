'use client';
import { once } from '@/utils/once';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function Form() {
  const { data: session, status } = useSession();

  const [name, setName] = useState<string>('');
  const [imageURL, setImageURL] = useState<string>('');
  const [resume, setResume] = useState<string>('');

  useEffect(() => {
    setName(session?.user?.name!); //세션이 없으면 리다이렉 시켰기 때문에 값이 무조건 있음
    setImageURL(session?.user?.image!);
  }, [status]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;
    if (file) {
      const imageUrl = URL.createObjectURL(file[0]);
      setImageURL(imageUrl);
    }
  };

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    once(() => {
      console.log('first');
    });
  };

  const handleResume = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResume(e.target.value);
  };

  return (
    <div className="w-3/5 rounded-xl flex flex-col gap-y-10 bg-gray-300 my-20 px-5 py-10">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-x-10">
          <div className="flex-grow-0 flex flex-col gap-y-4 ">
            <label htmlFor="profileImage">
              <Image src={imageURL} alt={name + '님의 사진'} width={200} height={200} className="rounded-full" priority/>
            </label>
            <input type="file" id="profileImage" accept="image/*" className="w-0 h-0 absolute p-0 overflow-hidden border-0" onChange={handleImage} />
            <input placeholder="이름" value={name} onChange={handleName} className="block w-full pl-1" />
          </div>
          <div className="flex-grow text-center border border-black rounded-md">
            <p className="text-2xl font-medium">이력서</p>
            <div className="flex h-4/5">
              <label htmlFor="pdfFile" className="mx-auto my-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                <p className="">업로드</p>
                <input type="file" id="pdfFile" accept=".pdf" className="w-0 h-0 absolute p-0 overflow-hidden border-0" />
              </label>
            </div>
          </div>
        </div>
        <div className="mt-5 flex items-end">
          <textarea
            id="resume"
            className="pl-1 h-52 flex-grow"
            maxLength={3000}
            placeholder="pdf 파일이 없다면 이력서를 입력하세요 (최대 3000자)"
            onChange={handleResume}
          />
          {resume.length + '자'}
        </div>
      </form>
      <button type="submit" className="mx-auto min-w-[15rem] p-2 rounded-md bg-blue-500 hover:bg-blue-400">
        저장
      </button>
    </div>
  );
}
