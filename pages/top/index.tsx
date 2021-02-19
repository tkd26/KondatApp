import React, { useState, useEffect } from 'react';

import Title from '@/components/atoms/Title';
import Link from 'next/link';
import firebase from '@/lib/firebase';
import { checkSignin } from '../auth/checkSignin';
import { getSignin } from '../auth/getSignin';
import { useRouter } from 'next/router';
import { firestore } from '@/lib/firebase';
import KondateTable from '../../components/page/KondateTable';

export type Menu = {
  name: string;
  restaurant: string;
};

const Index: React.FC = () => {
  checkSignin();
  // useEffect(() => {
  // }, []);
  
    const router = useRouter()
    const handleSubmit = async ( event: any ) => {
      const when = event.target.name
      getSignin().then((user: any) => {
        const today = new Date();
        const kondateCode = String(today.getFullYear()) + String(('00' + String(Number(today.getMonth())+1)).slice(-2)) + String(('00' + String(Number(today.getDate()))).slice(-2)) + when;
        console.log(kondateCode)
        console.log(user.email)
        try {
          firestore
            .collection(user.email)
            .doc(kondateCode)
            .onSnapshot((doc) => {
              if (doc.exists) {
                // 献立へ遷移
                // router.push('/kondate');
                router.push({ pathname: '/kondate', query: { kondateCode: kondateCode } });
              } else {
                // 推薦へ遷移
                router.push('/input');
              }
            })
        } catch (error) {
          alert(error);
        }
      })
  };


  return (
    <>
    <button onClick={() => firebase.auth().signOut()}>Sign out</button>
      <Title>トップページ</Title>
      <Link href="/input" passHref>
        <input type="submit" value="献立の登録" />
      </Link>
      <Link href="/nutrition" passHref>
        <input type="submit" value="栄養管理" />
      </Link>
        {/* <input onClick={handleSubmit} name='1' type="submit" value="朝ご飯の献立" />
        <input onClick={handleSubmit} name='2' type="submit" value="昼ご飯の献立" />
        <input onClick={handleSubmit} name='3' type="submit" value="夜ご飯の献立" /> */}
        <KondateTable />
    </>
  );
};

export default Index;
