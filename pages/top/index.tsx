import React from 'react';

import Link from 'next/link';
import { checkSignin } from '../../lib/auth/checkSignin';
import { getSignin } from '../../lib/auth/getSignin';
import { useRouter } from 'next/router';
import { firestore } from '@/lib/firebase';
import KondateTable from '../../components/page/KondateTable';
import { Button, Card,  } from 'react-bootstrap';

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
        <Card.Img
          src={`https://nanone-hukushima.com/wp-content/uploads/2018/07/%E8%8F%9C%E3%81%AE%E9%9F%B3_%E6%96%99%E7%90%86%E3%83%98%E3%83%83%E3%83%80%E3%83%BC.jpg`}
          alt="Card image"
          height="300"
        />
        <Card.ImgOverlay>
          <div className="card-content">
          <Card.Title className="cardTitle">献立一覧</Card.Title>
          <Link href="/input" passHref>
            <Button variant="danger"size="lg">献立の登録</Button>
          </Link>

          {'　　　'}
          <Link href="/manage" passHref>
            <Button variant="success"size="lg">栄養管理</Button>

          </Link>
          </div>
        </Card.ImgOverlay>
      </Card>
      <br />
        <div className='buttonbox'>
        <Button variant="info" onClick={handleSubmit} name='1'>今日の朝ご飯</Button>
        {"　　　　"}
        <Button variant="info" onClick={handleSubmit} name='2'>今日の昼ご飯</Button>
        {"　　　　"}
        <Button variant="info" onClick={handleSubmit} name='3'>今日の夜ご飯</Button>
        </div>
      <br />
      <KondateTable />
      <style>{`
          .card-img {
            opacity:0.8;
          }
          .buttonbox {
            display: flex;
            justify-content: center;
          }
          .cardTitle {
            font-size: 500%;
            font-weight: bold;
          }
          .card-content {
            background-color: white;
            padding: 10px;
          }
        `}</style>
    </>
  );
};

export default Index;
