import React, { useContext } from "react";
import firebase from '@/lib/firebase';
import { useRouter } from 'next/router'

type UserInfo = {
  id: string;
  password: string;
  address: string;
} 

const SignUp = () => {
  const router = useRouter()
  const handleSubmit = async event => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    try {
      await firebase.auth().createUserWithEmailAndPassword(email.value, password.value);
      router.push("/top");
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
        <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;