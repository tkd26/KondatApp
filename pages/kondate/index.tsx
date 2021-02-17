import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';

import Title from '@/components/atoms/Title';
import { firestore } from '@/lib/firebase';
import Link from 'next/link';

// const ADDRESS = '新宿'
// const GENRE = '和食'
const USER = 'user1';
const DATE = '202102162';

export type Kondate = {
  name: string;
  genre: string;
};
export type Restaurant = {
  name: string;
  url: string;
};
export type RestaurantJson = { [key: string]: { [key: string]: string } };
export type Info = {
  kondate: Kondate;
  address: string;
};
export type RecipeCategory = {
  categoryName: string;
  parentCategoryId: string;
  categoryId: number;
  categoryUrl: string;
}
export type RecipeJson = { [key: string]: string };
export type Recipe = {
  name: string;
  url: string;
}

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
    let categoryUrl = `https://app.rakuten.co.jp/services/api/Recipe/CategoryList/20170426?format=json&applicationId=1028773340156331413`;
    $.getJSON(categoryUrl, { url: categoryUrl }).then(
      // 成功時
      function (datas) {
        let smallCategory = datas.result.small.filter( function (item: RecipeCategory, index: number) {
          if ((item.categoryName).indexOf(kondate.name) >= 0) return item;
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

        const categoryId = `${largeCategory.categoryId}-${mediumCategory.categoryId}-${smallCategory.categoryId}`

        let url = `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?format=json&categoryId=${categoryId}&elements=recipeTitle%2CrecipeUrl&applicationId=1028773340156331413`;
        $.getJSON(url, { url: url }).then(
          function (datas) {
            const recipesData = datas.result.map(
              (data: RecipeJson) => ({
                name: data.recipeTitle,
                url: data.recipeUrl,
              })
            );
            setRecipes(recipesData);
          },
          // 失敗時
          function () {
            alert('Error');
          }
        )
      },
      // 失敗時
      function () {
        alert('Error');
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
              (data: RestaurantJson) => ({
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

  // メニューの取得
  useEffect(() => {
    firestore
      .collection(USER)
      .doc(DATE)
      .onSnapshot(function (doc) {
        const kondate = {
          name: doc.data()!.name,
          genre: doc.data()!.genre,
        };
        setKondate(kondate);
        getRecipes(kondate);

        firestore
          .collection('usermasta')
          .doc(USER)
          .onSnapshot(function (doc) {
            const address = doc.data()!.address;
            setAddress(address);
            getRestaurants(kondate, address);
          });
      });
  }, []);

  return (
    <>
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
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    </>
  );
};

export default Index;
