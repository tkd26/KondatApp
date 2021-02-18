import React, { useState, useEffect } from 'react';

import Title from '@/components/atoms/Title';
import Link from 'next/link';
import firebase from '@/lib/firebase';
import { checkSignin } from '../auth/checkSignin';

export type Menu = {
  name: string;
  restaurant: string;
};

const Index: React.FC = () => {
  checkSignin();
  // useEffect(() => {
  // }, []);

  return (
    <>
    <button onClick={() => firebase.auth().signOut()}>Sign out</button>
      <Title>トップページ</Title>
      <Link href="/input" passHref>
        <input type="submit" value="献立の登録" />
      </Link>
      <Link href="/kondate" passHref>
        <input type="submit" value="今日の献立" />
      </Link>
    </>
  );
};

export default Index;
