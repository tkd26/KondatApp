import React, { useEffect } from 'react';

import Title from '@/components/atoms/Title';
import Link from 'next/link';
import InputKondate from '@/components/page/InputKondate';
import Main from '@/components/page/Main'

export type Menu = {
  name: string;
  restaurant: string;
};

const Index: React.FC = () => {
  // useEffect(() => {
  //     }, []);
  return (
    <>
      <Title>献立登録</Title>
      <Link href="/top" passHref>
        <input type="submit" value="トップページへ" />
    </Link>
    <InputKondate/>
    </>
  );
};

export default Index;
