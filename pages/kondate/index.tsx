import React, { useState, useEffect, useImperativeHandle } from 'react';
import { useRouter } from 'next/router';

import Title from '@/components/atoms/Title';
import { firestore } from '@/lib/firebase';
import Link from 'next/link';
import { checkSignin } from '../auth/checkSignin';
import { getSignin } from '../auth/getSignin';
import firebase from '@/lib/firebase';

// const ADDRESS = '新宿'
// const GENRE = '和食'
// const USER = 'user1';
// const DATE = '202102182';

type Kondate = {
  name: string;
  genre: string;
};
type Restaurant = {
  name: string;
  url: string;
};
type Info = {
  user: string;
  kondate: Kondate;
  address: string;
};
type RecipeCategory = {
  categoryName: string;
  parentCategoryId: string;
  categoryId: number;
  categoryUrl: string;
};
type Recipe = {
  name: string;
  url: string;
};

const Index: React.FC = () => {
  
  const [kondate, setKondate] = useState<Kondate>({
    name: '',
    genre: '',
  });
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [address, setAddress] = useState<string>('');

  // レシピを取得する関数
  function getRecipes(kondate: Kondate) {
    const categoryUrl = `https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?format=json&applicationId=1028773340156331413`;
    $.getJSON(categoryUrl, { url: categoryUrl }).then(
      // 成功時
      function (datas) {
        let smallCategory = datas.result.small.filter( function (item: RecipeCategory, index: number) {
          if (item.categoryName.indexOf(kondate.name) >= 0) return item;
        });
        smallCategory = smallCategory[0];
        let mediumCategory = datas.result.medium.filter( function (item: RecipeCategory, index: number) {
          if (item.categoryId == smallCategory.parentCategoryId) return item;
        });
        mediumCategory = mediumCategory[0];

        let largeCategory = datas.result.large.filter( function (item: RecipeCategory, index: number) {
          if (item.categoryId == mediumCategory.parentCategoryId) return item;
        });
        largeCategory = largeCategory[0];

        const categoryId = `${largeCategory.categoryId}-${mediumCategory.categoryId}-${smallCategory.categoryId}`;
        const url = `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?format=json&categoryId=${categoryId}&elements=recipeTitle%2CrecipeUrl&applicationId=1028773340156331413`;
        $.getJSON(url, { url: url }).then(
          function (datas) {
            const recipesData = datas.result.map(
              (data: any) => ({
                name: data.recipeTitle,
                url: data.recipeUrl,
              })
            );
            setRecipes(recipesData);
          },
          // 失敗時
          function () {
            alert('Error2');
          }
        );
      },
      // 失敗時
      function () {
        alert('Error1');
      }
    );
  }

  // レストランを取得する関数
  function getRestaurants(kondate: Kondate, address: string) {
    let genreUrl = `https://webservice.recruit.co.jp/hotpepper/genre/v1/?key=30e9760c73b50820&keyword=${kondate.genre}&format=jsonp&callback=?`;
    genreUrl = encodeURI(genreUrl);
    // ジャンルマスタからジャンルコードを取得
    $.getJSON(genreUrl, { url: genreUrl }).then(
      // 成功時
      function (data) {
        const genreCode: string = data.results.genre[0].code;
        let url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=30e9760c73b50820&address=${address}&genre=${genreCode}&format=jsonp&callback=?`;
        url = encodeURI(url);
        // ジャンルコードとアドレスをもとにレストランを取得
        $.getJSON(url, { url: url }).then(
          // 成功時
          function (datas) {
            const restaurantsData = datas.results.shop.map(
              (data: any) => ({
                name: data.name,
                url: data.urls.pc,
              })
            );
            setRestaurants(restaurantsData);
          },
          // 失敗時
          function () {
            alert('Error');
          }
        );
      },
      // 失敗時
      function () {
        alert('Error');
      }
    );
  }
  
  checkSignin();
  
  const router = useRouter();

  // メニューの取得
  useEffect(() => {
    // ユーザ情報を取得
    getSignin().then((user: any) => {
      const userId = user.email;
      const kondateCode = String(router.query.kondateCode);
      return {userId: userId, kondateCode: kondateCode};
    }).then((data) => {
      firestore
        .collection(data.userId)
        .doc(data.kondateCode)
        .onSnapshot(function (doc) {
          const kondate = {
            name: doc.data()!.todo,
            genre: doc.data()!.genre,
          };
          setKondate(kondate);
          getRecipes(kondate);

          firestore
            .collection('usermasta')
            .doc(data.userId)
            .onSnapshot(function (doc) {
              const address = doc.data()!.address;
              setAddress(address);
              getRestaurants(kondate, address);
            });
        });
    }).catch((error) => {
      console.error(error);
    });
  }, []); 

  return (
    <>
    <button onClick={() => firebase.auth().signOut()}>Sign out</button>
      <Title>献立表示</Title>
      <div>住所：{address}</div>
      <div>ジャンル：{kondate.genre}</div>
      <div>献立：{kondate.name}</div>
      <h2>外食のおすすめ</h2>
      <ul>
        {restaurants.map((data, key) => {
          return (
            <li key={key}>
              <a href={data.url}>{data.name}</a>
            </li>
          );
        })}
      </ul>
      <h2>レシピのおすすめ</h2>
      <ul>
        {recipes.map((data, key) => {
          return (
            <li key={key}>
              <a href={data.url}>{data.name}</a>
            </li>
          );
        })}
      </ul>
      <Link href="/top" passHref>
        <input type="submit" value="トップページへ" />
      </Link>
    </>
  );
};

export default Index;
