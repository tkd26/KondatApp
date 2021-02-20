import React, { useState, useContext } from 'react';
import firebase from '@/lib/firebase';
import { useRouter } from 'next/router';
import { firestore } from '@/lib/firebase';
import Link from 'next/link';

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
      <h1>Sign up</h1>
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
          <label>
            Address
            <input name="address" type="text" placeholder="例：東京都新宿区" />
          </label>
        </div>
        <div>
          <button type="submit">Sign Up</button>
        </div>
        <div>
          <Link href="/signin" passHref>
            <button type="submit">Sign inページへ</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
