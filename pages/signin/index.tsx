import React, { useState, useEffect } from 'react';

import Title from '@/components/atoms/Title';
import Link from 'next/link';

export type Menu = {
  name: string;
  restaurant: string;
};


const Index: React.FC = () => {

  // useEffect(() => {}, []);

  return (
    <>
      <Title>サインイン</Title>
      <Link href="/top" passHref>
        <input type="submit" value="サインイン" />
      </Link>
    </>
  );
};

export default Index;
