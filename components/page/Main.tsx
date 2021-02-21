import React from 'react';
import { Space } from 'antd';
import {Jumbotron, Button} from 'react-bootstrap'

const Main: React.FC = () => {

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Jumbotron>
            <h1 style={{fontWeight:700, textAlign:"center"}}>献立アプリへようこそ！</h1>
            <br></br>
            <br></br>
            <p style={{textAlign:"center"}}>献立アプリは、飲食店と自炊を頑張る人を応援するWebアプリケーションです。</p>
            <p style={{textAlign:"center"}}>
            献立を決めてレシピを検索しよう。自炊に疲れた時や特別な日には、食べたい物を入力して、近くのお店を検索しよう。 </p>
            <br></br>
            <p style={{textAlign:"center"}}>
            <Button variant="success" href="/signup">献立アプリに登録する</Button>
            </p>
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
        .btn-wrap {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
        }
      `}</style>
    </>
  );
};

export default Main;
