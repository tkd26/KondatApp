import React from 'react';
import { Space } from 'antd';

import { firestore } from '@/lib/firebase';

import Form from '@/components/molecules/Form';
import Table from './Table';
import {Jumbotron, Button} from 'react-bootstrap'

const Sub: React.FC = () => {
    return (
        <>
    
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                    <h1 style={{fontWeight:700, textAlign:"center"}}>使用手順</h1>
                </div>
                <div>
                    <h2>1.</h2>
                </div>

                <div>
                    <h2>2.</h2>
                </div>

                <div>
                    <h2>3.</h2>
                </div>

                <div>
                    <h2>4.</h2>
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
      ` }</style>
        </>
    );
};

export default Sub;
