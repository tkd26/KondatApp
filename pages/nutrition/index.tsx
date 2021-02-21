import React, { useState, useEffect, useRef,PureComponent} from 'react';
import Graph from '@/pages/nutrition/dataset';
import Title from '@/components/atoms/Title';
import { firestore } from '@/lib/firebase';
import Link from 'next/link';
import {Menu} from '@/types/menu';
import {Nutri} from '@/types/nutrition';
import { max } from 'date-fns';
import {Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { getSignin } from '../../lib/auth/getSignin';
import { useRouter } from 'next/router';

import { isBefore, formatISO } from 'date-fns';

import {
  Card,
  CardDeck,
} from 'react-bootstrap';


// 理想の栄養成分
const ideal_cal = 833;
const ideal_fat = 23.1;
const ideal_na = 1.0;
const ideal_protain = 16.7;
const ideal_ca = 266.7;
const ideal_carb = 50.7;
let today = new Date();

export type Rader = {
  subject: string,
  A: number,
  B: number,
  fullMark: number,
}
type Restaurant = {
  name: string;
  url: string;
  image: string;
};


// let raderData = [{}]

const Index: React.FC = () => {
  const raderUrl = 'https://codesandbox.io/s/simple-radar-chart-rjoc6';

  // firebaseからデータを取得
  const [menus, setMenus] = useState<Menu[]>([]);
  const [nutri, setNutri] = useState<Nutri[]>([]);
  // 推薦するジャンルを格納する
  const [ideal_genre, setIdeal] = useState<String>('');
  // 自分の今までの栄養素の合計を格納
  const [fat, setFat] = useState(0);
  const [cal, setCal] = useState(0);
  const [na, setNa] = useState(0);
  const [protain, setProtain] = useState(0);
  const [ca, setCa] = useState(0);
  const [carb, setCarb] = useState(0);
  const [rader_data, setRader] = useState<Rader[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([{
    name: '',
    url: '',
    image: '',
  }]);

  const [norm, setNorm] = useState(10000);  // 最も短い距離を格納するためのもの
  const [datanum, setNum] = useState(0); // 自分のデータ数を保持する

  const router = useRouter();

  // レストランを取得する関数
  async function getRestaurants(genre: String, address: String) {
    let genreUrl = `https://webservice.recruit.co.jp/hotpepper/genre/v1/?key=30e9760c73b50820&keyword=${genre}&format=jsonp&callback=?`;
    genreUrl = encodeURI(genreUrl);
    // ジャンルマスタからジャンルコードを取得
    await $.getJSON(genreUrl, { url: genreUrl }).then(
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

  // メニューの取得
  useEffect(() => {
    getSignin().then(async (user: any) => {
      const userId = user.email;
      const kondateCode = String(router.query.kondateCode);
      await firestore
        .collection('usermasta')
        .doc(user.email)
        .onSnapshot(function (doc) {
          const address = doc.data()!.address;
          getRestaurants(ideal_genre, address);
        });
      return {userId: userId, kondateCode: kondateCode, address: user.address};
    }).then((data) => {
      firestore.collection(data.userId).onSnapshot((collection) => {
        const data = collection.docs.map<Menu>((doc) => ({
          userId: doc.data().userId,
          id: doc.data().id,
          genre: doc.data().genre,
          isComplete: doc.data().isComplete,
          date: doc.data().date,
          day: doc.data().day,
          month: doc.data().month,
          year: doc.data().year,
          todo: doc.data().todo,
          when: doc.data().when,
        }));
        // stateに取得したデータをセット
  
 const sortedTodos = data.sort((a, b) =>
    isBefore(Number(a.day), Number(b.day)) ? -1 : 1
      );
      const filteredmenus =sortedTodos.filter(function (v) {
        const kondateDate = new Date(v.year, v.month - 1, v.day, 24, 0);
        const current = new Date();
        // 過去のどれくらい得るか決める
        return  (current.getMonth()===kondateDate.getMonth() && (current.getDate() - kondateDate.getDate()) <= 10 && (current.getDate() - kondateDate.getDate()) >= 0)
        || (current.getMonth() === kondateDate.getMonth()+1 && (kondateDate.getDate() - current.getDate()) >= 20 );
      });
          setMenus(filteredmenus);
      });

      firestore.collection('nutrition').onSnapshot((collection) => {
        const data2 = collection.docs.map<Nutri>((doc) => ({
        id: doc.data().id,
        genre: doc.data().genre,
        cal: doc.data().cal,
        fat: doc.data().fat,
        protain: doc.data().protain,
        carb: doc.data().carb,
        na: doc.data().na,
        ca: doc.data().ca,
        }));

        setNutri(data2);
      });
    })
        
        
    }, [ideal_genre]);

    useEffect (() => {
      let cnt = 0;
      let my_cal_num = 0.0
      let my_fat_num = 0.0;
      let my_protain_num = 0.0;
      let my_na_num = 0.0;
      let my_ca_num = 0.0;
      let my_carb_num = 0.0;
      menus.map((data) => {
        if(data.date < today){
          cnt++;
          nutri.map((data2) => {
            if (data.genre === data2.genre){
              my_cal_num += data2.cal;
              my_fat_num += data2.fat;
              my_na_num += data2.na;
              my_protain_num += data2.protain;
              my_carb_num += data2.carb;
              my_ca_num += data2.ca;
            }
          })
        }
        setNum(cnt);
        setCal(my_cal_num);
        setFat(my_fat_num);
        setProtain(my_protain_num);
        setNa(my_na_num);
        setCa(my_ca_num);
        setCarb(my_carb_num);
        console.log(cal)
      });
      // あるジャンルの食事をすると仮定した場合の蓄積される合計の栄養素
      let virtual_cal = 0;
      let virtual_fat = 0;
      let virtual_protain = 0;
      let virtual_carb = 0;
      let virtual_na = 0;
      let virtual_ca = 0;

      let hoge = 0;
      // ここで理想のジャンルを求める計算をする
      nutri.map((data2) => {
          virtual_cal = (Number(data2.cal) + cal) / (datanum+1);
          virtual_fat = (Number(data2.fat) + fat) / (datanum+1);
          virtual_protain = (Number(data2.protain) + protain) / (datanum+1);
          virtual_carb = (Number(data2.carb) + carb) / (datanum+1);
          virtual_na = (Number(data2.na) + na) / (datanum+1);
          virtual_ca = (Number(data2.ca) + ca) / (datanum+1);
          hoge = (Math.pow((virtual_fat-ideal_fat)/ideal_fat, 2) + Math.pow((virtual_na-ideal_na)/ideal_na, 2) + Math.pow((virtual_protain-ideal_protain)/ideal_protain, 2)+Math.pow((virtual_carb-ideal_carb)/ideal_carb, 2)+Math.pow((virtual_ca-ideal_ca)/ideal_ca, 2)+Math.pow((virtual_cal-ideal_cal)/ideal_cal, 2))
          if (norm > hoge){
            setNorm(hoge);
            setIdeal(data2.genre);
          }
      });

      // レーダーチャートに使うデータ
 
    }, [menus,nutri])
    const raderData = [
      {
        subject: '炭水化物',
        A: cal/datanum/ideal_cal,
        B: 1,
        fullMark: 1,
      },
      {
        subject: 'タンパク質',
        A: protain/datanum/ideal_protain,
        B: 1,
        fullMark: 1,
      },
      {
        subject: 'カルシウム',
        A:ca/datanum/ideal_ca,
        B: 1,
        fullMark: 1,
      },
      {
        subject: 'カロリー',
        A: cal/datanum/ideal_cal,
        B: 1,
        fullMark: 1,
      },
      {
        subject: '塩分',
        A: na/datanum/ideal_na,
        B: 1,
        fullMark: 1,
      },
      {
        subject: '脂質',
        A: fat/datanum/ideal_fat,
        B: 1,
        fullMark: 1,
      },
    ];

    return (
    <>
    <h1>あなたの栄養バランス</h1>
    <div className='top-graph'>
    <RadarChart  // レーダーチャート全体の設定を記述
                cx={250}  // 要素の左端とチャートの中心点との距離(0にするとチャートの左半分が隠れる)
                cy={250}  // 要素の上部とチャートの中心点との距離(0にするとチャートの上半分が隠れる)
                outerRadius={150}  // レーダーチャート全体の大きさ  
                width={500}  // レーダーチャートが記載される幅(この幅よりチャートが大きい場合、はみ出た箇所は表示されない)
                height={500}   // レーダーチャートが記載される高さ
                data={raderData}  // 表示対象のデータ
            >
                {/* レーダーチャートの蜘蛛の巣のような線 */}
                <PolarGrid />
                {/* 項目を決めるデータのキー(サンプルでいう数学や歴史) */}
                <PolarAngleAxis dataKey="subject" />
                
                {/* 目安となる数値が表示される線を指定  */}
                <PolarRadiusAxis 
                    angle={30}  // 中心点から水平を0°とした時の角度 垂直にしたいなら90を指定
                    domain={[0, 2]}  // リストの１番目の要素が最小値、2番目の要素が最大値
                />  
                
                {/* レーダーを表示 */}
                <Radar 
                    name="あなたの栄養バランス"  // そのチャートが誰のデータか指定(チャート下にここで指定した値が表示される)
                    dataKey="A"   // 表示する値と対応するdata内のキー
                    stroke="#8884d8"  // レーダーの外枠の色
                    fill="#8884d8"  // レーダー内の色
                    fillOpacity={0.6}  // レーダー内の色の濃さ(1にすると濃さMAX)
                />
                {/* ２個目のレーダー */}
                <Radar name="理想的な栄養バランス" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />

                {/* グラフの下のAさんBさんの表記 */}
                <Legend />
            </RadarChart>
    </div>
    <div className='top-graph'>
    <h2>おすすめの料理のジャンルは『{ideal_genre}』です</h2>
    </div>
    {/* <h2>理想との最短距離:{norm}です</h2> */}
    <br/>
    <br/>
    <br/>
    <h2 className='under'>「{ideal_genre}」で外食・テイクアウトするならココ！</h2>
    <CardDeck key="restaurants">
      {restaurants.map((data, key) => {
        return (
          <>
            <a href="{data.url}">
              <Card style={{ width: '15rem' }} key={String(key)}>
                <Card.Img
                  style={{ width: '15rem', height: '15rem' }}
                  variant="top"
                  src={data.image}
                />
                <Card.Body>
                  {/* <Card.Title></Card.Title> */}
                  <Card.Text>{data.name}</Card.Text>
                </Card.Body>
              </Card>
            </a>
          </>
        );
      })}
    </CardDeck>
    <br/>

    {/* <Graph/> */}

    <style jsx>{`
      h1 {
        font-weight: bold;
      }
      .under {
        font-weight: bold;
        background: linear-gradient(transparent 70%, #d2b48c 70%);
      }
      .top-graph {
        display: flex;
        justify-content: center;
      }
    `}</style>

    </>
    );
};

export default Index;

