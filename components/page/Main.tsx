import React from 'react';
import { Space } from 'antd';

import { firestore } from '@/lib/firebase';

import Form from '@/components/molecules/Form';
import Table from './Table';
import {Jumbotron, Button} from 'react-bootstrap'

const Main: React.FC = () => {

  return (
    <>
    
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Button variant="info" size="lg" active href="/signin">Sign in</Button>{" "}
          <Button variant="success" size="lg" active href="/signup">Sign up</Button>
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
