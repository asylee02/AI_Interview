import EnterRoom from '@/components/EnterRoom';
import Main from '@/components/Main';
import Test from '@/components/Test';
import Test2 from '@/components/Test2';
import Sex from '@/components/sex';
import MyContext from '@/context/Mycontext';
import React, { useRef, useState } from 'react';

type Props = {
  params: {
    slug: string;
  };
};

export default function Page({ params }: Props) {
  const [hidden, setHidden] = useState(false);
  const roomName = useRef<HTMLInputElement>(null);
  return (
    <MyContext.Provider value={{ hidden, setHidden, roomName: roomName }}>
      <main>
        {/* <EnterRoom />
        <Main /> */}
        sex
        <Sex id={params.slug} />
        {/* <Test2 id={params.slug} /> */}
        {/* <Test/> */}
      </main>
    </MyContext.Provider>
  );
}

export const getServerSideProps = async (context: any) => {
  const { slug } = context.params;
  return {
    props: {
      params: {
        slug,
      },
    },
  };
};
