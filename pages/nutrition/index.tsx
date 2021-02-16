import React, { useState, useEffect, Component} from 'react';

import Title from '@/components/atoms/Title';
import { firestore } from '@/lib/firebase';
import Link from 'next/link';
import {Menu} from '@/types/menu';
import {Nutri} from '@/types/nutrition';
let fat_num = 0.0;
let protain_num = 0.0;
let water_num = 0.0;

const Index: React.FC = () => {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [nutri, setNutri] = useState<Nutri[]>([]);
    

    // メニューの取得
    useEffect(() => {
        firestore.collection('konndate').onSnapshot((collection) => {
            const data = collection.docs.map<Menu>((doc) => ({
            id: doc.data().id,
            genre: doc.data().genre,
            isComplete: doc.data().isComplete,
            date: doc.data().date,
            day: doc.data().day,
            todo: doc.data().todo,
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
          nutri.map((data2) => {
            if (data.genre === data2.genre){
              fat_num += Number(data2.fat);
              water_num += Number(data2.water);
              protain_num += Number(data2.protain);
              console.log(water_num);

            }
          })
        });
    }, []);

    return (
    <>
    <Title>Firebase Todo App</Title>
    <ul>
        {menus.map((data,key) => {
        return <li key={key}>{data.todo}</li>;
        })}
    </ul>
    <ul>
      <li>fat: {fat_num}</li>
      <li>water: {water_num}</li>
      <li>protain: {protain_num}</li>
    </ul>
    <Link href="/top" passHref>
        <input type="submit" value="トップページへ" />
    </Link>
    </>
    );
};

export default Index;
