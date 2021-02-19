import React, { useState, useEffect } from 'react';
import { isBefore, formatISO } from 'date-fns';
import { Table as AntTable, Switch, Button } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import {
  CloseOutlined,
  CheckOutlined,
  DeleteOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';

import EditKondate from '@/components/molecules/EditKondate';

import { firestore } from '@/lib/firebase';
import { Menu } from '@/types/menu';
import { getSignin } from '../../pages/auth/getSignin';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { BrowserRouter } from 'react-router-dom';

type PropsUserId = {
  PropsUserId: string;
};

const columns: ColumnsType<Menu> = [
  // {
  //   title: 'Status',
  //   dataIndex: 'status',
  //   key: 'status',
  //   render: (_, { userId, id, isComplete }) => {
  //     const el = (
  //       <Switch
  //         checkedChildren={<CheckOutlined />}
  //         unCheckedChildren={<CloseOutlined />}
  //         defaultChecked
  //         checked={isComplete}
  //         onChange={(checked) =>
  //           firestore
  //             .collection(userId)
  //             .doc(id)
  //             .update({ isComplete: checked })
  //         }
  //       />
  //     );
  //     return el;
  //   },
  // },
  {
    title: '日程',
    dataIndex: 'day',
    key: 'day',
    render: (_, { day, month, year, isComplete}) => {
      const el = (
        <div style={{ textDecoration: isComplete ? 'line-through' : 'none' }}>
          {year}年{month}月{day}日
        </div>
      );
      return el;
    },
  },
  {
    title: '時間帯',
    dataIndex: 'when',
    key: 'when',
    render: (_, { when, isComplete}) => {
      const el = (
        <div style={{ textDecoration: isComplete ? 'line-through' : 'none' }}>
          {when}
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
    render: (_, { userId, id }) => {
      const el = (
        <Button
          type="dashed"
          shape="circle"
          icon={<DeleteOutlined />}
          onClick={() => firestore.collection(userId,).doc(id).delete()}
        />
      );
      return el;
    },
  },
  {
    title: '献立を作る',
    dataIndex: 'detail',
    key: 'detail',
    render: (_, { userId, id, year, month, day, when }) => {
      const whenNum = (when === '朝ご飯') ? '1': (when === '昼ご飯') ? '2': (when === '夜ご飯') ? '3': ''
      const kondateCode = `${year}${String((('00' + String(month)).slice(-2)))}${String((('00' + String(day)).slice(-2)))}${whenNum}`
      const el = (
        <>
        <BrowserRouter>
        <Link href={{ pathname: '/kondate', query: { kondateCode:  kondateCode} }}>
        <Button
          shape="circle"
          icon={<ArrowRightOutlined />}
        />
        </Link>
        </BrowserRouter>
        </>
      );
      return el;
    },
  },
];


const KondateTable: React.FC = () => {
  // state
  const [todos, setTodos] = useState<Menu[]>([]);
  const today1 = new Date();
  const year1 = Number(today1.getFullYear());
  const month1 = Number(today1.getMonth());
  const day1 = Number(today1.getDate());

  // const [router, setRouter] = useState<any>();
  const router = useRouter()
  // init
  useEffect(() => {
    // setRouter(routera);
    getSignin().then((user: any) => {
      if (user){
        firestore.collection(user.email)
        // .where('year', '>=', 'month')
        // .where('month', '>=', 1)
        // .where('day', '>=',1)
        .onSnapshot((collection) => {
          const data = collection.docs.map<Menu>((doc) => ({
            userId: user.email,
            id: doc.id,
            genre: doc.data().genre,
            todo: doc.data().todo,
            isComplete: doc.data().isComplete,
            date: doc.data().date.toDate(),
            day: doc.data().day,
            month: doc.data().month,
            year: doc.data().year,
            when: doc.data().when,
          }));
          setTodos(data);
        });
      } else {
        // No user is signed in.
        // console.log('false');
        router.push('/signin');
      }
  });
  }, []);

  const sortedTodos = todos.sort((a, b) => (isBefore(Number(a.day), Number(b.day)) ? -1 : 1));
  // 現在の日付より前の献立は除外
  sortedTodos.some(function(v, i){
    const kondateDate = new Date(v.year, v.month-1, v.day, 24, 0);
    const current = new Date();
    if (kondateDate.getTime() < current.getTime()) sortedTodos.splice(i,1);
  });
  return <AntTable rowKey="id" dataSource={sortedTodos} columns={columns} />;
};

export default KondateTable;
