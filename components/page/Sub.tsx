import React from 'react';
import { Space } from 'antd';
import {Jumbotron} from 'react-bootstrap'

const Sub: React.FC = () => {
    return (
        <>
    
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Jumbotron>
                    <div>
                        <h1 style={{fontWeight:700, textAlign:"center"}}>使用手順</h1>
                    </div>
                    <div className="container">
                        <h2>1. ユーザ登録</h2>
                        <br></br>
                        <p>まずは、ユーザ登録をして、献立アプリを始めよう！ </p>
                        
                    </div>

                    <div className="container">
                        <h2>2. 献立登録</h2>
                        <br></br>
                        <p>献立を登録しよう！</p>
                        <img src={'/static/menu_registration.png'} style={{width: '100%', height:'100%'}}/>
                    </div>

                    <div className="container">
                        <br></br>
                        <h2>3. レシピ・お店を検索</h2>
                        <p>決めた献立をもとにレシピを検索しよう！</p>
                        <img src='/static/recipe_recommendation.png'style={{width: '100%', height:'100%'}} />
                        <p>もしくは…外食を検討しよう！食べたいメニューを献立に登録し、オススメのお店を探そう！</p>
                        <img src='/static/restaurant_recommendation.png' style={{width: '100%', height:'100%'}} />
                    </div>

                </Jumbotron>
            </Space>
        <style jsx>{`
            .form-wrap {
            display: flex;
            flex-direction: column;
            margin-bottom: 5%;
            padding: 3rem;
            background-color: white;
            }
            .container{
                justify-content: center;
            }
            .btn-wrap {
            margin-top: 1rem;
            display: flex;
            justify-content: flex-end;
            }
      ` }</style>
        </>
    );
};

export default Sub;
