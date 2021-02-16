import React from 'react';
import { Space } from 'antd';

import { firestore } from '@/lib/firebase';

import KondateForm from '@/components/molecules/KondateForm';
import KondateTable from './KondateTable';
import generateCalendar from 'antd/lib/calendar/generateCalendar';

const InputKondate: React.FC = () => {
  const addKondate= (todo: string, genre: string) =>
    // firestoreにデータを追加する
    firestore.collection('konndate').add({
            genre: genre,
            todo: todo,
            isComplete: false,
            date: new Date(),
        })

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div className="form-wrap">
          <KondateForm onSubmit={addKondate} />
        </div>
        <KondateTable />
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

export default InputKondate;
