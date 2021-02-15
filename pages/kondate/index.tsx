import React, { useState, useEffect } from 'react';

import Title from '@/components/atoms/Title';
import { firestore } from '@/lib/firebase';
import Link from 'next/link';

export type Menu = {
  name: string;
  restaurant: string;
};


const Index: React.FC = () => {
    const [menus, setMenus] = useState<Menu[]>([]);

    // メニューの取得
    useEffect(() => {
        firestore.collection('konndate').onSnapshot((collection) => {
            const data = collection.docs.map<Menu>((doc) => ({
            name: doc.data().name,
            restaurant: doc.data().restaurant,
            }));
            // stateに取得したデータをセット
            setMenus(data);
        });
        }, []);

    return (
    <>
    <Title>Firebase Todo App</Title>
    <ul>
        {menus.map((data,key) => {
        return <li key={key}>{data.name}</li>;
        })}
    </ul>
    <Link href="/top" passHref>
        <input type="submit" value="トップページへ" />
    </Link>
    </>
    );
};



export default Index;
