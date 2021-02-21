import React from 'react';

import Title from '@/components/atoms/Title';
import Link from 'next/link';
import InputKondate from '@/components/page/InputKondate';

export type Menu = {
  name: string;
  restaurant: string;
};

const Index: React.FC = () => {

  return (
    <>
      <Title>献立登録</Title>
      <InputKondate />
    </>
  );
};

export default Index;
