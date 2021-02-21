import React, { useContext } from "react";
import firebase from '@/lib/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';
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
       <Container>
        <h1 className="text-center fw-bold">サインインする</h1>
       </Container>
       <br></br>
       <br></br>
      <form onSubmit={handleSubmit}>
        <div className="text-center fw-bold">
        <label >
          <input id="email" name="email" type="email"  placeholder="メールアドレス" />
        </label>
        </div>
        <div className="text-center fw-bold">
        <label>
          <input  id="pasword" name="password"  type="password" placeholder="パスワード" />
        </label>
        </div>
        <br></br>
        <div className='buttonbox'>
        <p>
        <Button  id="pasword" type="submit" variant="info"　className="text-center fw-bold" size="lg" >サインイン</Button>{' '}
        </p>
        </div>
      <style>{'.buttonbox {display: flex;justify-content: center};input{width:25em;}'}</style>
      
        <div className='buttonbox'>
        <Button  href="/signup" id="pasword" type="submit" variant="secondary" >サインアップページへ</Button>
   
        </div>
      </form>
    <style jsx>{`
      #email{
      width:25em;}
      #pasword{
      width:25em;}
      `}
      </style>
    </div>
  );
};
export default Signin