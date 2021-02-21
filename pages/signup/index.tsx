import React from 'react';
import firebase from '@/lib/firebase';
import { useRouter } from 'next/router';
import { firestore } from '@/lib/firebase';
import Link from 'next/link';
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

const SignUp = () => {
  const router = useRouter();
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const { email, password, address } = event.target.elements;
    try {
      // ユーザアカウント作成
      await firebase
        .auth()
        .createUserWithEmailAndPassword(email.value, password.value);
      // ユーザマスタにユーザ情報を追加
      await firestore
        .collection('usermasta')
        .doc(email.value)
        .set({
          address: address.value,
          password: password.value,
        })
        .then(() => {
          console.log('Document successfully written!');
        })
        .catch((error) => {
          console.error('Error writing document: ', error);
        });
      // トップページへ遷移
      router.push('/top');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <Container>  
       <h1 className="text-center fw-bold">サインアップ</h1>
      </Container>
      <br></br>
      <form onSubmit={handleSubmit}>
        <div　className="text-center fw-bold">
          <label>
            <input id="inputbox" name="email" type="email" placeholder="Email" />
          </label>
        </div>
        <div　className="text-center fw-bold">
          <label>
            <input  id="inputbox" name="password" type="password" placeholder="Password" />
          </label>
        </div>
        <div　className="text-center fw-bold">
          <label>
            <input　id="inputbox" name="address" type="text" placeholder="住所（例：東京都新宿区）" />
          </label>
        </div>
        <br></br>
        <br></br>
        <style>{'.buttonbox {display: flex;justify-content: center};input{width:25em;}'}</style>
        <div className='buttonbox'>
          <Button type="submit" variant="info"　className="text-center fw-bold" size="lg" >サインアップ</Button>
        </div>
        <br></br>
        <div className='buttonbox'>
          <Link href="/signin" passHref>
            <Button type="submit" variant="secondary">サインインページへ</Button>
          </Link>
        </div>
      </form>
      <style jsx>{`
      #inputbox{
      width:25em;}
      #pasword{
      width:25em;}
      `}
      </style>
    </div>
  );
};

export default SignUp;
