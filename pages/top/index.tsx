import React, { useState, useEffect } from 'react';

import Title from '@/components/atoms/Title';
import Link from 'next/link';
import firebase from '@/lib/firebase';
import { checkSignin } from '../auth/checkSignin';
import { getSignin } from '../auth/getSignin';
import { useRouter } from 'next/router';
import { firestore } from '@/lib/firebase';
import KondateTable from '../../components/page/KondateTable';
import { Jumbotron, Button, Container, Image, Card } from 'react-bootstrap';

export type Menu = {
  name: string;
  restaurant: string;
};

const Index: React.FC = () => {
  checkSignin();
  // useEffect(() => {
  // }, []);

  const router = useRouter();
  const handleSubmit = async (event: any) => {
    const when = event.target.name;
    getSignin().then((user: any) => {
      const today = new Date();
      const kondateCode =
        String(today.getFullYear()) +
        String(('00' + String(Number(today.getMonth()) + 1)).slice(-2)) +
        String(('00' + String(Number(today.getDate()))).slice(-2)) +
        when;
      console.log(kondateCode);
      console.log(user.email);
      try {
        firestore
          .collection(user.email)
          .doc(kondateCode)
          .onSnapshot((doc) => {
            if (doc.exists) {
              // 献立へ遷移
              // router.push('/kondate');
              router.push({
                pathname: '/kondate',
                query: { kondateCode: kondateCode },
              });
            } else {
              // 推薦へ遷移
              router.push('/nutrition');
            }
          });
      } catch (error) {
        alert(error);
      }
    });
  };

  return (
    <>
      <Card className="text-center fw-bold">
        {/* <div style="opacity: 0.2;"> */}
        <Card.Img
          src="https://tokubai-news-photo-production.tokubai.co.jp/c/w=1400,h=865,a=2,f=jpg/fd32/bfb5/9b90/7409/eebd/ded8/0e0b/e46d/aea76014fa972093.png"
          alt="Card image"
          height="300"
        />
        {/* </div> */}
        <Card.ImgOverlay>
          <Card.Title>献立一覧</Card.Title>
          {/* <Card.Text>
          This is a wider card with supporting text below as a natural lead-in to
          additional content. This content is a little bit longer.
        </Card.Text> */}
          <Link href="/input" passHref>
            <Button variant="success">献立の登録</Button>
          </Link>
          {'  '}
          <Link href="/nutrition" passHref>
            <Button variant="info">栄養管理</Button>
          </Link>
        </Card.ImgOverlay>
      </Card>
      <br />
      <br />
      <div className="iconbox">
        <Image
          src="https://iconbox.fun/wp/wp-content/uploads/146_w_24.svg"
          roundedCircle
          height="50"
          width="50"
          onClick={handleSubmit}
          name="1"
        />
        <p>説明</p>
        </div>
        {'　　　　　　　'}
        <div className="iconbox">
        <Image
          src="https://iconbox.fun/wp/wp-content/uploads/145_w_24.svg"
          roundedCircle
          height="50"
          width="50"
          onClick={handleSubmit}
          name="2"
        />
        <p>説明</p>
        </div>
        {'　　　　　　　'}
        <Image
          src="https://iconbox.fun/wp/wp-content/uploads/158_w_24.svg"
          roundedCircle
          height="50"
          width="50"
          onClick={handleSubmit}
          name="3"
        />

        {/* <Button variant="success" onClick={handleSubmit} name='2' >今日の昼ご飯</Button>
          <Button variant="success" onClick={handleSubmit} name='3' >今日の夜ご飯</Button> */}
      <br />
      <br />
      <KondateTable />

      <style>{`
          .iconbox {
            float: left;
          }
        `}</style>
    </>
  );
};

export default Index;
