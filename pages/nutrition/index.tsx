import React, { useState, useEffect, useRef,PureComponent} from 'react';
import Square from '@/pages/nutrition/dataset';
import Title from '@/components/atoms/Title';
import { firestore } from '@/lib/firebase';
import Link from 'next/link';
import {Menu} from '@/types/menu';
import {Nutri} from '@/types/nutrition';
import { max } from 'date-fns';
import {Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

let my_cal_num = 0.0
let my_fat_num = 0.0;
let my_protain_num = 0.0;
let my_na_num = 0.0;
let my_ca_num = 0.0;
let my_carb_num = 0.0;

let nutri_comp = '';
let data_num = 0; // 自分が食べたものの数(現状未来の献立も含まれてしまっている)
let norm1 = 100000; // もっとも短い距離を収容するためのもの
let ideal_genre = ''; // おすすめするジャンルを格納するためのもの

// 理想の栄養成分
const ideal_cal = 833;
const ideal_fat = 23.1;
const ideal_na = 1.0;
const ideal_protain = 16.7;
const ideal_ca = 266.7;
const ideal_carb = 50.7;
let today = new Date();

let raderData = [{}]

const Index: React.FC = () => {
  const raderUrl = 'https://codesandbox.io/s/simple-radar-chart-rjoc6';
    const [menus, setMenus] = useState<Menu[]>([]);
    const [nutri, setNutri] = useState<Nutri[]>([]);
    console.log('ok');

    // メニューの取得
    useEffect(() => {
        firestore.collection('konndate').onSnapshot((collection) => {
            const data = collection.docs.map<Menu>((doc) => ({
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
            setMenus(data);
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
        menus.map((data) => {
          if(data.date < today){
            data_num++;
            nutri.map((data2) => {
              if (data.genre === data2.genre){
                my_cal_num += Number(data2.cal);
                my_fat_num += Number(data2.fat);
                my_na_num += Number(data2.na);
                my_protain_num += Number(data2.protain);
                my_carb_num += Number(data2.carb);
                my_ca_num += Number(data2.ca);
              }
            })
          }
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
            virtual_cal = (Number(data2.cal) + my_cal_num) / (data_num+1);
            virtual_fat = (Number(data2.fat) + my_fat_num) / (data_num+1);
            virtual_protain = (Number(data2.protain) + my_protain_num) / (data_num+1);
            virtual_carb = (Number(data2.carb) + my_carb_num) / (data_num+1);
            virtual_na = (Number(data2.na) + my_na_num) / (data_num+1);
            virtual_ca = (Number(data2.ca) + my_ca_num) / (data_num+1);
            hoge = (Math.pow((virtual_fat-ideal_fat)/ideal_fat, 2) + Math.pow((virtual_na-ideal_na)/ideal_na, 2) + Math.pow((virtual_protain-ideal_protain)/ideal_protain, 2)+Math.pow((virtual_carb-ideal_carb)/ideal_carb, 2)+Math.pow((virtual_ca-ideal_ca)/ideal_ca, 2)+Math.pow((virtual_cal-ideal_cal)/ideal_cal, 2))
            console.log(hoge);
            if (norm1 > hoge){
              norm1 = hoge;
              ideal_genre = data2.genre;
            }
            console.log(ideal_genre)
        });
        console.log(ideal_genre);
    }, []);

    // レーダーチャートに使うデータ
    raderData = [
      {
        subject: '炭水化物',
        A: my_cal_num/data_num/ideal_cal,
        B: 1,
        fullMark: 1,
      },
      {
        subject: 'タンパク質',
        A: my_protain_num/data_num/ideal_protain,
        B: 1,
        fullMark: 1,
      },
      {
        subject: 'カルシウム',
        A:my_ca_num/data_num/ideal_ca,
        B: 1,
        fullMark: 1,
      },
      {
        subject: 'カロリー',
        A: my_cal_num/data_num/ideal_cal,
        B: 1,
        fullMark: 1,
      },
      {
        subject: '塩分',
        A: my_na_num/data_num/ideal_na,
        B: 1,
        fullMark: 1,
      },
      {
        subject: '脂質',
        A: my_fat_num/data_num/ideal_fat,
        B: 1,
        fullMark: 1,
      },
    ];

    return (
    <>
    <Title>デリバリーまたは外食はいかが？</Title>
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
    <h2>おすすめの料理のジャンルは『{ideal_genre}』です</h2>
    <h2>理想との最短距離:{norm1}です</h2>
    <Square name = {ideal_genre}
      // cal = {my_cal_num/data_num}
      // fat = {my_fat_num/data_num}
      // protain = {my_protain_num/data_num}
      // carb = {my_carb_num/data_num}
      // na = {my_na_num/data_num}
      // ca = {my_ca_num/data_num}
    />
    <h3>あなたの栄養摂取状況</h3>
    <ul>
      <li>cal: {my_cal_num/data_num}</li>
      <li>fat: {my_fat_num/data_num}</li>
      <li>protain: {my_protain_num/data_num}</li>
      <li>carb: {my_carb_num/data_num}</li>
      <li>na: {my_na_num/data_num}</li>
      <li>ca: {my_ca_num/data_num}</li>
    </ul>
    <h3>理想の栄養摂取状況です</h3>
    <ul>
      <li>fat: {ideal_fat}</li>
      <li>na: {ideal_na}</li>
      <li>protain: {ideal_protain}</li>
    </ul>
    <Link href="/top" passHref>
        <input type="submit" value="トップページへ" />
    </Link>
    </>
    );
};

export default Index;
