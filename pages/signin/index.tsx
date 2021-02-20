import React, { useContext } from "react";
import firebase from '@/lib/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

const Signin = () => {
  const router = useRouter()
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      // ユーザ認証
      await firebase.auth().signInWithEmailAndPassword(email.value, password.value);
      // トップページへ遷移
      router.push('/top');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div>
      <Jumbotron fluid>
       <Container>
       <center>
        <h1>献立ページへサインイン</h1>
      　</center>
       </Container>
       </Jumbotron>
      <form onSubmit={handleSubmit}>
        <div>
        <center>
        <label>
          Email　　
          <input name="email" type="email" placeholder="メールアドレス" />
        </label>
        </center>
        </div>
        <div>
        <center>
        <label>
          Password
          <input name="password" type="password" placeholder="パスワード" /><label></label>
        </label>
        </center>
        <p>
        <center>
        <Button type="submit" variant="info"　size="lg" >Sign in</Button>{' '}
        </center>
        </p>
        </div>
        <div>
        <Link href="/signup" passHref>
        <center>
        <Button type="submit" variant="secondary">Sign upページへ</Button>
        </center>
        </Link>
        </div>
      </form>
      
    </div>
  );
};

export default Signin;