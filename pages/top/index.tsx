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
          src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fnanone-hukushima.com%2F%25E8%258F%259C%25E3%2581%25AE%25E9%259F%25B3_%25E6%2596%2599%25E7%2590%2586%25E3%2583%2598%25E3%2583%2583%25E3%2583%2580%25E3%2583%25BC%2F&psig=AOvVaw0UevJD3KkUCgd7wBPURGG5&ust=1613899312323000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCKjviM2R-O4CFQAAAAAdAAAAABAD"
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
      {/* <center> */}
      {/* <a name="1" onClick={handleSubmit} >
        <Image
          src="https://iconbox.fun/wp/wp-content/uploads/146_w_24.svg"
          roundedCircle
          height="50"
          width="50"
        />
        </a>
        {'　　　　　　　'}
        <Image
          src="https://iconbox.fun/wp/wp-content/uploads/145_w_24.svg"
          roundedCircle
          height="50"
          width="50"
          onClick={handleSubmit}
          name="2"
        />
        {'　　　　　　　'}
        <Image
          src="https://iconbox.fun/wp/wp-content/uploads/158_w_24.svg"
          roundedCircle
          height="50"
          width="50"
          onClick={handleSubmit}
          name="3"
        /> */}

        <div className='buttonbox'>
        <Button variant="success" onClick={handleSubmit} name='1'>今日の朝ご飯</Button>
        {"　　　　"}
        <Button variant="success" onClick={handleSubmit} name='2' >今日の昼ご飯</Button>
        {"　　　　"}
        <Button variant="success" onClick={handleSubmit} name='3' >今日の夜ご飯</Button>
        </div>
      {/* </center> */}
      <br />
      <br />
      <KondateTable />

      <style>{`
          .card-img {
            opacity:0.3;
          }
          .buttonbox {
            display: flex;
            justify-content: center;
          }
        `}</style>
    </>
  );
};

export default Index;
