import React, { useState, useEffect } from 'react';
import axios from "axios";

import Title from '@/components/atoms/Title';
import { firestore } from '@/lib/firebase';
import Link from 'next/link';

const ADDRESS = "新宿"
// const GENRE = "和食"
const USER = "user1"
const DATE = "202102162"

export type Menu = {
  name: string;
  restaurant: string;
};
export type Kondate = {
    name: string;
    genre: string;
  };
export type Restaurant = {
    name: string;
    url: string;
  };

export type RestaurantJson = {[key:string]: {[key:string]:string}};

const Index: React.FC = () => {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [kondate, setKondate] = useState<Kondate>({
        name: '',
        genre: '',
    });
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    
    // 献立を取得
    const getKondate = new Promise<Kondate>(function(resolve){
        firestore.collection(USER).doc(DATE).onSnapshot(function(doc) {
            const kondateData = {
                name: doc.data()!.name,
                genre: doc.data()!.genre,
            }
            resolve(kondateData);
        });
    })

    // レストランを取得
    function getRestaurants(address:string, genre:string) {
        var genreurl = `https://webservice.recruit.co.jp/hotpepper/genre/v1/?key=30e9760c73b50820&keyword=${genre}&format=jsonp&callback=?`;
        genreurl = encodeURI(genreurl);
        // ジャンルマスタからジャンルコードを取得
        $.getJSON(genreurl, {"url":genreurl}).then(
            // 成功時
            function(data){
                const genreCode:string = data.results.genre[0].code;
                var url =`https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=30e9760c73b50820&address=${address}&genre=${genreCode}&format=jsonp&callback=?`;
                url = encodeURI(url);
                // ジャンルコードとアドレスをもとにレストランを取得
                $.getJSON(url, {"url":url}).then(
                    // 成功時
                    function(datas){
                        const restaurantsData = datas.results.shop.map((data:RestaurantJson) => ({
                            name: data.name,
                            url: data.urls.pc
                        }));
                        setRestaurants(restaurantsData);
                    },
                    // 失敗時
                    function(){
                        alert("Error");
                    })
            },
            // 失敗時
            function(){ 
                alert("Error");
            });
    }

    // メニューの取得
    useEffect(() => {

        // 献立ジャンルを取得した後に，レストラン取得
        getKondate.then((kondateData) => {
                setKondate(kondateData);
                getRestaurants(ADDRESS, kondateData.genre);
            });
            
        
        }, []);

    return (
    <>
    <Title>献立表示</Title>
    <div>住所：{ADDRESS}</div>
    <div>ジャンル：{kondate.genre}</div>
    <div>献立：{kondate.name}</div>
    <h2>外食のおすすめ</h2>
    <ul>
        {restaurants.map((data,key) => {
        return <li key={key}><a href={data.url}>{data.name}</a></li>;
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
