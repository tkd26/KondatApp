import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import { firestore } from '@/lib/firebase';
import Form from '@/components/molecules/Form';
import { Menu as MenuItem } from '@/types/menu';
import { getSignin } from '../../lib/auth/getSignin';

type Props = {
  todoItem: MenuItem;
};

const EditKondate: React.FC<Props> = ({ todoItem }) => {
  // state
  const [isOpen, setIsOpen] = useState(false);

  const updateTodo = async (
    todo: string,
    genre: string,
    when: string,
    day: number,
    month: number,
    year: number
  ) => {
    getSignin().then(async (user: any) => {
      await firestore
        .collection(user.email)
        .doc(todoItem.id)
        .update({
          todo: todo,
          genre: genre,
          when: when,
          day: day - 1,
          month: month,
          year: year,
          isComplete: todoItem.isComplete,
          date: todoItem.date,
        });
      setIsOpen(false);
    });
  };

  return (
    <>
      <Button
        shape="circle"
        icon={<EditOutlined />}
        onClick={() => setIsOpen(true)}
      />
      <Modal
        title="Edit"
        visible={isOpen}
        onCancel={() => setIsOpen(false)}
        footer={null}
      >
        {isOpen && (
          <Form
            onSubmit={updateTodo}
            todo={todoItem.todo}
            genre={todoItem.genre}
            when={todoItem.when}
            day={todoItem.day}
            month={todoItem.month}
          />
        )}
      </Modal>
    </>
  );
};

export default EditKondate;
