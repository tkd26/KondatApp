import React, {useState, useEffect, PureComponent, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {Menu} from '@/types/menu';
import {Nutri} from '@/types/nutrition';
import { firestore } from '@/lib/firebase';
import { isBefore, formatISO } from 'date-fns';
import { checkSignin } from '@/lib/auth/checkSignin';
import { getSignin } from '@/lib/auth/getSignin';
import { useRouter } from 'next/router';

// 和食
 const j_cal = 877;
 const j_fat = 13.0;
 const j_na = 2.1;
 const j_protain = 16.8;
 const j_ca = 102.5;
 const j_carb = 45.0;
// 洋食
 const a_cal = 694;
 const a_fat = 19.8;
 const a_na = 0.63;
 const a_protain = 16.6;
 const a_ca = 287.5;
 const a_carb = 42.6;
// イタリアン・フレンチ
 const i_cal = 961;
 const i_fat = 18.7;
 const i_na = 1.5;
 const i_protain = 17.4;
 const i_ca = 266.0;
 const i_carb = 75.6;
// 中華
 const c_cal = 1065;
 const c_fat = 24.1;
 const c_na = 1.37;
 const c_protain = 15.7;
 const c_ca = 147.5;
 const c_carb = 88.5;
// 焼肉・ホルモン
 const m_cal = 1656;
 const m_fat = 49.5;
 const m_na = 0.77;
 const m_protain = 24.4;
 const m_ca = 95.0;
 const m_carb = 67.0;
// 韓国料理
 const k_cal = 951;
 const k_fat = 22.6;
 const k_na = 0.63;
 const k_protain = 20.0;
 const k_ca = 330.0;
 const k_carb = 72.7;
// アジア・エスニック料理
 const e_cal = 591;
 const e_fat = 10.7;
 const e_na = 0.68;
 const e_protain = 10.0;
 const e_ca = 98.0;
 const e_carb = 55.3;
// ラーメン
 const r_cal = 741;
 const r_fat = 9.9;
 const r_na = 1.75;
 const r_protain = 14.5;
 const r_ca = 220.0;
 const r_carb = 72.8;
// お好み焼き・もんじゃ
 const o_cal = 692;
 const o_fat = 22.1;
 const o_na = 0.84;
 const o_protain = 11.6;
 const o_ca = 315.0;
 const o_carb = 61.0;
// その他
 const s_cal = 833;
 const s_fat = 23.1;
 const s_na = 1.0;
 const s_protain = 16.7;
 const s_ca = 266.7;
 const s_carb = 50.7;

// 理想の栄養成分
const ideal_cal = 833;
const ideal_fat = 23.1;
const ideal_na = 1.0;
const ideal_protain = 16.7;
const ideal_ca = 266.7;
const ideal_carb = 50.7;

 type N_data = {
  id: string;
  genre: string;
  あなた: number;
  理想: number;
};


const Graph: React.FC = () => {
  // 描画用
  const jsfiddleUrl = 'https://jsfiddle.net/alidingling/xqjtetw0/';
  const [menus1, setMenus1] = useState<Menu[]>([]);
  const [nutri1, setNutri1] = useState<Nutri[]>([]);
  const [cal_data, setCal] = useState<N_data[]>([]);
  const [carb_data, setCarb] = useState<N_data[]>([]);
  const [ca_data, setCa] = useState<N_data[]>([]);
  const [fat_data, setFat] = useState<N_data[]>([]);
  const [na_data, setNa] = useState<N_data[]>([]);
  const [protain_data, setProtain] = useState<N_data[]>([]);
  const [data_num, setDataNum] = useState(0);

  const router = useRouter();
  useEffect(() => {

    getSignin().then((user: any) => {
      const userId = user.email;
      const kondateCode = String(router.query.kondateCode);
      return {userId: userId, kondateCode: kondateCode};
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

      setMenus1(filteredmenus);
      });
      

      // 栄養情報を得る
      firestore.collection('nutrition').onSnapshot((collection) => {
        const dd2 = collection.docs.map<Nutri>((doc) => ({
        id: doc.data().id,
        genre: doc.data().genre,
        cal: doc.data().cal,
        fat: doc.data().fat,
        protain: doc.data().protain,
        na: doc.data().na,
        ca: doc.data().ca,
        carb: doc.data().carb,
        }));
        setNutri1(dd2);
    });
    })
}, []);
  useEffect(() => {
    const d_cal = menus1.map<N_data>((doc) => ({
      id: String(doc.year)+'年'+String(doc.month)+'月'+String(doc.day)+'日'+(doc.when === '朝ご飯'? '朝':doc.when === '昼ご飯'?'昼':'夜'),
      genre: doc.genre,
      あなた: (doc.genre === '和食') ? j_cal:
            (doc.genre === '洋食') ? a_cal:
            (doc.genre === 'イタリアン・フレンチ') ? i_cal:
            (doc.genre === '中華') ? c_cal:
            (doc.genre === '焼肉・ホルモン') ? m_cal:
            (doc.genre === '韓国料理') ? k_cal:
            (doc.genre === 'アジア・エスニック料理') ? e_cal:
            (doc.genre === 'ラーメン') ? j_cal:
            (doc.genre === 'お好み焼き・もんじゃ') ? o_cal:
            s_cal,
      理想: ideal_cal
      }));
      setCal(d_cal);
    const d_ca = menus1.map<N_data>((doc) => ({
      id: String(doc.year)+'年'+String(doc.month)+'月'+String(doc.day)+'日'+(doc.when === '朝ご飯'? '朝':doc.when === '昼ご飯'?'昼':'夜'),
      genre: doc.genre,
      あなた: (doc.genre === '和食') ? j_ca:
            (doc.genre === '洋食') ? a_ca:
            (doc.genre === 'イタリアン・フレンチ') ? i_ca:
            (doc.genre === '中華') ? c_ca:
            (doc.genre === '焼肉・ホルモン') ? m_ca:
            (doc.genre === '韓国料理') ? k_ca:
            (doc.genre === 'アジア・エスニック料理') ? e_ca:
            (doc.genre === 'ラーメン') ? j_ca:
            (doc.genre === 'お好み焼き・もんじゃ') ? o_ca:
            s_ca,
      理想: ideal_ca
      }));
    setCa(d_ca);
    const d_carb = menus1.map<N_data>((doc) => ({
      id: String(doc.year)+'年'+String(doc.month)+'月'+String(doc.day)+'日'+(doc.when === '朝ご飯'? '朝':doc.when === '昼ご飯'?'昼':'夜'),
      genre: doc.genre,
      あなた: (doc.genre === '和食') ? j_carb:
            (doc.genre === '洋食') ? a_carb:
            (doc.genre === 'イタリアン・フレンチ') ? i_carb:
            (doc.genre === '中華') ? c_carb:
            (doc.genre === '焼肉・ホルモン') ? m_carb:
            (doc.genre === '韓国料理') ? k_carb:
            (doc.genre === 'アジア・エスニック料理') ? e_carb:
            (doc.genre === 'ラーメン') ? j_carb:
            (doc.genre === 'お好み焼き・もんじゃ') ? o_carb:
            s_carb,
        理想: ideal_carb
      }));
    setCarb(d_carb);
    const d_fat = menus1.map<N_data>((doc) => ({
      id: String(doc.year)+'年'+String(doc.month)+'月'+String(doc.day)+'日'+(doc.when === '朝ご飯'? '朝':doc.when === '昼ご飯'?'昼':'夜'),
      genre: doc.genre,
      あなた: (doc.genre === '和食') ? j_fat:
            (doc.genre === '洋食') ? a_fat:
            (doc.genre === 'イタリアン・フレンチ') ? i_fat:
            (doc.genre === '中華') ? c_fat:
            (doc.genre === '焼肉・ホルモン') ? m_fat:
            (doc.genre === '韓国料理') ? k_fat:
            (doc.genre === 'アジア・エスニック料理') ? e_fat:
            (doc.genre === 'ラーメン') ? j_fat:
            (doc.genre === 'お好み焼き・もんじゃ') ? o_fat:
            s_fat,
        理想: ideal_fat
      }));
    setFat(d_fat);
    const d_na = menus1.map<N_data>((doc) => ({
      id: String(doc.year)+'年'+String(doc.month)+'月'+String(doc.day)+'日'+(doc.when === '朝ご飯'? '朝':doc.when === '昼ご飯'?'昼':'夜'),
      genre: doc.genre,
      あなた: (doc.genre === '和食') ? j_na:
            (doc.genre === '洋食') ? a_na:
            (doc.genre === 'イタリアン・フレンチ') ? i_na:
            (doc.genre === '中華') ? c_na:
            (doc.genre === '焼肉・ホルモン') ? m_na:
            (doc.genre === '韓国料理') ? k_na:
            (doc.genre === 'アジア・エスニック料理') ? e_na:
            (doc.genre === 'ラーメン') ? j_na:
            (doc.genre === 'お好み焼き・もんじゃ') ? o_na:
            s_na,
        理想: ideal_na
      }));
      setNa(d_na);
      const d_protain = menus1.map<N_data>((doc) => ({
        id: String(doc.year)+'年'+String(doc.month)+'月'+String(doc.day)+'日'+(doc.when === '朝ご飯'? '朝':doc.when === '昼ご飯'?'昼':'夜'),
        genre: doc.genre,
        あなた: (doc.genre === '和食') ? j_protain:
              (doc.genre === '洋食') ? a_protain:
              (doc.genre === 'イタリアン・フレンチ') ? i_protain:
              (doc.genre === '中華') ? c_protain:
              (doc.genre === '焼肉・ホルモン') ? m_protain:
              (doc.genre === '韓国料理') ? k_protain:
              (doc.genre === 'アジア・エスニック料理') ? e_protain:
              (doc.genre === 'ラーメン') ? j_protain:
              (doc.genre === 'お好み焼き・もんじゃ') ? o_protain:
              s_protain,
        理想: ideal_protain
        }));
        console.log(d_protain)
        setProtain(d_protain);
  
      setDataNum(d_fat.length);
  }, [menus1,nutri1])
  return (
    <>
    <h2>＜カロリー＞</h2>
      <LineChart
        width={500}
        height={300}
        data={cal_data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="id" />
        <YAxis unit = 'kcal'/>
        <Tooltip />
        <Legend verticalAlign="top" height={10}/>
        <Line type="monotone" dataKey="あなた" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="理想" stroke="#82ca9d" activeDot={{ r: 8 }} />
      </LineChart>
    <h2>＜炭水化物＞</h2>
    <LineChart
        width={500}
        height={300}
        data={carb_data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="id" />
        <YAxis unit = 'g'/>
        <Tooltip />
        <Legend verticalAlign="top" height={10}/>
        <Line type="monotone" dataKey="あなた" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="理想" stroke="#82ca9d" activeDot={{ r: 8 }} />
        {/* <Line y1 = {59}>mylabel</Line> */}
      </LineChart>
      <h2>＜脂質＞</h2>
      <LineChart
        width={500}
        height={300}
        data={fat_data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="id" />
        <YAxis unit = 'g'/>
        <Tooltip />
        <Legend verticalAlign="top" height={10}/>
        <Line type="monotone" dataKey="あなた" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="理想" stroke="#82ca9d" activeDot={{ r: 8 }} />
      </LineChart>
      <h2>＜タンパク質＞</h2>
      <LineChart
        width={500}
        height={300}
        data={protain_data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="id" />
        <YAxis unit = 'g'/>
        <Tooltip />
        <Legend verticalAlign="top" height={10}/>
        <Line type="monotone" dataKey="あなた" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="理想" stroke="#82ca9d" activeDot={{ r: 8 }} />
      </LineChart>
      <h2>＜塩分＞</h2>
      <LineChart
        width={500}
        height={300}
        data={na_data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="id" />
        <YAxis unit = 'g'/>
        <Tooltip />
        <Legend verticalAlign="top" height={10}/>
        <Line type="monotone" dataKey="あなた" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="理想" stroke="#82ca9d" activeDot={{ r: 8 }} />
        {/* <Line y1 = {59}>mylabel</Line> */}
      </LineChart>
      <h2>＜カルシウム＞</h2>
      <LineChart
        width={500}
        height={300}
        data={ca_data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="id" />
        <YAxis unit = 'mg'/>
        <Tooltip />
        <Legend verticalAlign="top" height={10}/>
        <Line type="monotone" dataKey="あなた" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="理想" stroke="#82ca9d" activeDot={{ r: 8 }} />
        {/* <Line y1 = {59}>mylabel</Line> */}
      </LineChart>
    </>
  )
}

export default Graph;
