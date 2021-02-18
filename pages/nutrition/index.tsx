import React, { useState, useEffect, useRef} from 'react';

import Title from '@/components/atoms/Title';
import { firestore } from '@/lib/firebase';
import Link from 'next/link';
import {Menu} from '@/types/menu';
import {Nutri} from '@/types/nutrition';
import { max } from 'date-fns';
let my_fat_num = 0.0;
let my_protain_num = 0.0;
let my_water_num = 0.0;
let str_genre = '';
let nutri_comp = '';
let data_num = 0; // 自分が食べたものの数(現状未来の献立も含まれてしまっている)
let norm1 = 100000; // もっとも短い距離を収容するためのもの
let ideal_genre = ''; // おすすめするジャンルを格納するためのもの
// 理想の栄養成分
const ideal_fat = 44;
const ideal_water = 31;
const ideal_protain = 77;
let today = new Date();

const Index: React.FC = () => {
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
          fat: doc.data().fat,
          protain: doc.data().protain,
          water: doc.data().water,
          }));

          setNutri(data2);
      });
        menus.map((data) => {
          if(data.date < today){
            data_num++;
            nutri.map((data2) => {
              if (data.genre === data2.genre){
                my_fat_num += Number(data2.fat);
                my_water_num += Number(data2.water);
                my_protain_num += Number(data2.protain);
                console.log(my_water_num);

              }
            })
          }
        });
        // my_fat_num *= 1 / data_num;
        // my_water_num *= 1 / data_num;
        // my_protain_num *= 1 / data_num;
        // console.log(my_water_num);
        // if (Math.max(my_fat_num, my_water_num, my_protain_num) === my_fat_num){
        //   nutri_comp = '脂質';
        //   str_genre = '和食';
        // }else if (Math.max(my_fat_num, my_water_num, my_protain_num) === my_water_num){
        //   nutri_comp = 'タンパク質';
        //   str_genre = '洋食';
        // }else{
        //   nutri_comp = '水分';
        //   str_genre = 'イタリアン・フレンチ';
        // }

        let virtual_fat = 0;
        let virtual_water = 0;
        let virtual_protain = 0;


        let hoge = 0;

        nutri.map((data2) => {
            virtual_fat = (Number(data2.fat) + my_fat_num) / data_num;
            virtual_water = (Number(data2.water) + my_water_num) / data_num;
            virtual_protain = (Number(data2.protain) + my_protain_num) / data_num;
            hoge = (Math.pow(virtual_fat-ideal_fat, 2) + Math.pow(virtual_water-ideal_water, 2) + Math.pow(virtual_protain-ideal_protain, 2))
            if (norm1 > hoge){
              norm1 = hoge;
              ideal_genre = data2.genre;
            }
            console.log(hoge);
            console.log(ideal_genre);
        });
        str_genre = ideal_genre;


        return ()=> {
          console.log('unmount');
        }
    }, []);

    return (
    <>
    <Title>デリバリーまたは外食はいかが？</Title>
    <h2>どうやら{nutri_comp}を取りすぎているようです</h2>
    <h2>おすすめの料理のジャンルは『{str_genre}』です</h2>
    <h2>データ数は{data_num}です</h2>
    <h2>理想との最短距離は{norm1}です</h2>
    <ul>
        {menus.map((data,key) => {
        return <li key={key}>{data.todo}</li>;
        })}
    </ul>
    <h3>あなたの栄養摂取状況</h3>
    <ul>
      <li>fat: {my_fat_num/data_num}</li>
      <li>water: {my_water_num/data_num}</li>
      <li>protain: {my_protain_num/data_num}</li>
    </ul>
    <h3>理想の栄養摂取状況</h3>
    <ul>
      <li>fat: {ideal_fat}</li>
      <li>water: {ideal_water}</li>
      <li>protain: {ideal_protain}</li>
    </ul>
    <Link href="/top" passHref>
        <input type="submit" value="トップページへ" />
    </Link>
    </>
    );
};

export default Index;
