import firebase from '@/lib/firebase';
import { useRouter } from 'next/router'

export const checkSignin = () =>{
  const router = useRouter()
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      // console.log(user);
    } else {
      // No user is signed in.
      // console.log('false');
      router.push('/signin');

    }
  });
};