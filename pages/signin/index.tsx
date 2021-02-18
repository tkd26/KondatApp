import React, { useContext } from "react";
import firebase from '@/lib/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';

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
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit}>
        <div>
        <label>
          Email
          <input name="email" type="email" placeholder="Email" />
        </label>
        </div>
        <div>
        <label>
          Password
          <input name="password" type="password" placeholder="Password" />
        </label>
        </div>
        <div>
        <button type="submit">Sign in</button>
        </div>
        <div>
        <Link href="/signup" passHref>
        <button type="submit">Sign upページへ</button>
        </Link>
        </div>
      </form>
    </div>
  );
};

export default Signin;