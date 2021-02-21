import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { firestore } from '@/lib/firebase';
import { checkSignin } from '../../lib/auth/checkSignin';
import { getSignin } from '../../lib/auth/getSignin';
import {
  Card,
  CardDeck,
} from 'react-bootstrap';

type Kondate = {
  name: string;
  genre: string;
};
type Restaurant = {
  name: string;
  url: string;
  image: string;
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
  image: string;
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
        let smallCategory = datas.result.small.filter(function (
          item: RecipeCategory,
          index: number
        ) {
          if (item.categoryName.indexOf(kondate.name) >= 0) return item;
        });
        smallCategory = smallCategory[0];
        let mediumCategory = datas.result.medium.filter(function (
          item: RecipeCategory,
          index: number
        ) {
          if (item.categoryId == smallCategory.parentCategoryId) return item;
        });
        mediumCategory = mediumCategory[0];

        let largeCategory = datas.result.large.filter(function (
          item: RecipeCategory,
          index: number
        ) {
          if (item.categoryId == mediumCategory.parentCategoryId) return item;
        });
        largeCategory = largeCategory[0];

        const categoryId = `${largeCategory.categoryId}-${mediumCategory.categoryId}-${smallCategory.categoryId}`;
        const url = `https://app.rakuten.co.jp/services/api/Recipe/CategoryRanking/20170426?format=json&categoryId=${categoryId}&elements=recipeTitle%2CrecipeUrl%foodImageUrl&applicationId=1028773340156331413`;
        $.getJSON(url, { url: url }).then(
          function (datas) {
            const recipesData = datas.result.map((data: any) => ({
              name: data.recipeTitle,
              url: data.recipeUrl,
              image: data.foodImageUrl,
            }));
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
        let url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=30e9760c73b50820&count=4&address=${address}&genre=${genreCode}&format=jsonp&callback=?`;
        url = encodeURI(url);
        // ジャンルコードとアドレスをもとにレストランを取得
        $.getJSON(url, { url: url }).then(
          // 成功時
          function (datas) {
            const restaurantsData = datas.results.shop.map((data: any) => ({
              name: data.name,
              url: data.urls.pc,
              image: data.photo.pc.l,
            }));
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
    getSignin()
      .then((user: any) => {
        const userId = user.email;
        const kondateCode = String(router.query.kondateCode);
        return { userId: userId, kondateCode: kondateCode };
      })
      .then((data) => {
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
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Card className="text-center fw-bold">
        <Card.Img
          src={`https://nanone-hukushima.com/wp-content/uploads/2018/07/%E8%8F%9C%E3%81%AE%E9%9F%B3_%E6%96%99%E7%90%86%E3%83%98%E3%83%83%E3%83%80%E3%83%BC.jpg`}
          alt="Card image"
          height="300"
        />
        <Card.ImgOverlay>
          <Card.Title className="cardTitle">{kondate.name} のレシピ</Card.Title>
        </Card.ImgOverlay>
      </Card>
      <br/>
      <br/>
      <br/>
      <br/>

      <h2 className='under'>レシピのおすすめ</h2>
      { recipes.length==0 && <p>検索結果が見つかりませんでした</p> }
      <CardDeck key="recipes">
        {recipes.map((data, key) => {
          return (
            <>
              <a href={data.url}  target = "_blank">
                <Card style={{ width: '15rem' }} key={String(key)}>
                  <Card.Img
                    style={{ width: '15rem', height: '15rem' }}
                    variant="top"
                    src={data.image}
                  />
                  <Card.Body>
                    <Card.Text>{data.name}</Card.Text>
                  </Card.Body>
                </Card>
              </a>
            </>
          );
        })}
      </CardDeck>
      <br/>
      <br/>
      <h2 className='under'>「{kondate.genre}」で外食・テイクアウトするならココ！</h2>
      <CardDeck key="restaurants">
        {restaurants.map((data, key) => {
          return (
            <>
              <a href={data.url} target = "_blank">
                <Card style={{ width: '15rem' }} key={String(key)}>
                  <Card.Img
                    style={{ width: '15rem', height: '15rem' }}
                    variant="top"
                    src={data.image}
                  />
                  <Card.Body>
                    <Card.Text>{data.name}</Card.Text>
                  </Card.Body>
                </Card>
              </a>
            </>
          );
        })}
      </CardDeck>

      <style>{`
          .card-img {
            opacity:0.8;
          }
          .cardTitle {
            font-size: 400%;
            font-weight: bold;
            background: white;
            padding: 10px;
          }
          .under {
            font-weight: bold;
            background: linear-gradient(transparent 70%, #d2b48c 70%);
          }
        `}</style>
    </>
  );
};

export default Index;
