import React, { useState, useEffect } from 'react';
import { isBefore, formatISO } from 'date-fns';
import { Table as AntTable, Switch, Button } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import {
  CloseOutlined,
  CheckOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import EditKondate from '@/components/molecules/EditKondate';

import { firestore } from '@/lib/firebase';
import { Menu } from '@/types/menu';
  

const columns: ColumnsType<Menu> = [
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (_, { id, isComplete }) => {
      const el = (
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
          defaultChecked
          checked={isComplete}
          onChange={(checked) =>
            firestore
              .collection('konndate')
              .doc(id)
              .update({ isComplete: checked })
          }
        />
      );
      return el;
    },
  },
  {
    title: 'ジャンル',
    dataIndex: 'genre',
    key: 'genre',
    render: (_, { genre, isComplete}) => {
      const el = (
        <div style={{ textDecoration: isComplete ? 'line-through' : 'none' }}>
          {genre}
        </div>
      );
      return el;
    },
  },
  {
    title: '献立',
    dataIndex: 'todo',
    key: 'todo',
    render: (_, { todo, isComplete}) => {
      const el = (
        <div style={{ textDecoration: isComplete ? 'line-through' : 'none' }}>
          {todo}
        </div>
      );
      return el;
    },
  },
  {
    title: '日程',
    dataIndex: 'day',
    key: 'day',
    render: (_, { day, isComplete}) => {
      const el = (
        <div style={{ textDecoration: isComplete ? 'line-through' : 'none' }}>
          {day}
        </div>
      );
      return el;
    },
  },
  // {
  //   title: 'Created',
  //   dataIndex: 'date',
  //   key: 'date',
  //   render: (_, { date }) => formatISO(date),
  // },
  {
    title: 'edit',
    dataIndex: 'edit',
    key: 'edit',
    render: (_, todo) => {
      const el = <EditKondate todoItem={todo} />;
      return el;
    },
  },
  {
    title: 'delete',
    dataIndex: 'delete',
    key: 'delete',
    render: (_, { id }) => {
      const el = (
        <Button
          type="dashed"
          shape="circle"
          icon={<DeleteOutlined />}
          onClick={() => firestore.collection('konndate').doc(id).delete()}
        />
      );
      return el;
    },
  },
];

const KondateTable: React.FC = () => {
  // state
  const [todos, setTodos] = useState<Menu[]>([]);

  // init
  useEffect(() => {
    firestore.collection('konndate').onSnapshot((collection) => {
      const data = collection.docs.map<Menu>((doc) => ({
        id: doc.id,
        genre: doc.data().genre,
        todo: doc.data().todo,
        isComplete: doc.data().isComplete,
        date: doc.data().date.toDate(),
        day: doc.data().day,
      }));
      setTodos(data);
    });
  }, []);

  const sortedTodos = todos.sort((a, b) => (isBefore(a.date, b.date) ? 1 : -1));

  return <AntTable rowKey="id" dataSource={sortedTodos} columns={columns} />;
};

export default KondateTable;
