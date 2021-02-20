import firebase from '@/lib/firebase';

// ユーザ情報を取得する関数
export var getSignin = () => {
  return new Promise((resolve) => {
    var unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      // user オブジェクトを resolve
      resolve(user);

      // 登録解除
      unsubscribe();
    });
  });
};
