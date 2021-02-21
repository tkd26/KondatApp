import React from 'react';
import { Space } from 'antd';
import {Jumbotron, Button} from 'react-bootstrap'


const Main: React.FC = () => {

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Jumbotron>
            <div className='top-graph'>
              <img src={'/static/logo-big.png'} style={{ width: '50%', height:'50%'}} />
            </div>
            <br></br>
            <h1 style={{fontWeight:700, textAlign:"center"}}>らくっくへようこそ！</h1>
            <br></br>
            <br></br>
            <p style={{textAlign:"center"}}>らくっくは、飲食店と自炊を頑張る人を応援するWebアプリケーションです。</p>
            <p style={{textAlign:"center"}}>
            献立を決めてレシピを検索しよう。自炊に疲れた時や特別な日には、食べたい物を入力して、近くのお店を検索しよう。 </p>
            <br></br>
            <p style={{textAlign:"center"}}>
            <Button variant="success" href="/signup">らくっくに登録する</Button>
            </p>
        </Jumbotron>
      </Space>

      <style jsx>{`
        .top-graph {
          display: flex;
          justify-content: center;
        }
      `}</style>
    </>
  );
};

export default Main;
