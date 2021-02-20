import React from 'react';
import { Space } from 'antd';

import { firestore } from '@/lib/firebase';

import Form from '@/components/molecules/Form';
import Table from './Table';
import {Jumbotron, Button, Card} from 'react-bootstrap'

const Main: React.FC = () => {

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Card bg="secondary" className="text-center fw-bold">
            <Card.Title>献立アプリへようこそ！</Card.Title>
            <Button variant="success" href="/signup">献立アプリに登録する</Button>
          </Card>
        </div>
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
