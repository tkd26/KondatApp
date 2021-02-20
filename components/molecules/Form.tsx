import React from 'react';
import { Form as AntForm, Input, Button, Select } from 'antd';

const initialValues = {
  todo: '',
  genre: '',
  when: '',
  day: 0,
  month: 0,
  year: 0,
};

type Props = {
  onSubmit: (
    todo: string,
    genre: string,
    when: string,
    day: number,
    month: number,
    year: number
  ) => Promise<unknown>;
  todo?: string;
  genre?: string;
  when?: string;
  day?: number;
  month?: number;
  year?: number;
};

const Form: React.FC<Props> = ({ onSubmit, todo, genre, when, day, month }) => {
  const today = new Date();
  const date = today.getDate();
  const month2 = today.getMonth();

  // let dayValue = `${month + 1}月${day}日`

  const [form] = AntForm.useForm();

  const handleFinish = async ({
    todo,
    genre,
    when,
    day,
  }: typeof initialValues) => {
    await onSubmit(
      todo,
      genre,
      when,
      today.getDate() + Number(day),
      today.getMonth() + 1,
      today.getFullYear()
    );
    form.resetFields();
  };

  return (
    <>
      <AntForm
        form={form}
        initialValues={{ todo, genre, when, day: '' }}
        onFinish={handleFinish}
      >
        <AntForm.Item
          className="input-wrap"
          label="献立"
          name="todo"
          rules={[{ required: true, message: '献立を入力してください' }]}
        >
          <Input placeholder="Add Kondate" />
        </AntForm.Item>
        {/* <AntForm.Item
          className="input-wrap"
          label="朝昼晩"
          name="when"
          rules={[{ required: true, message: '献立を入力してください' }]}
        >
          <Select>
            <Select.Option type="radio" value="1">
              朝ご飯
            </Select.Option>
            <Select.Option type="radio" value="2">
              昼ご飯
            </Select.Option>
            <Select.Option type="radio" value="3">
              夜ご飯
            </Select.Option>
          </Select>
        </AntForm.Item> */}
        <AntForm.Item
          className="input-wrap-genre"
          label="ジャンル（選択）"
          name="genre"
          rules={[{ required: true, message: 'ジャンルを選択してください' }]}
        >
          <Select>
            <Select.Option value="和食">和食</Select.Option>
            <Select.Option value="洋食">洋食</Select.Option>
            <Select.Option value="イタリアン・フレンチ">
              イタリアン・フレンチ
            </Select.Option>
            <Select.Option value="中華">中華</Select.Option>
            <Select.Option value="焼肉・ホルモン">焼肉・ホルモン</Select.Option>
            <Select.Option value="韓国料理">韓国料理</Select.Option>
            <Select.Option value="アジア・エスニック料理">
              アジア・エスニック料理
            </Select.Option>
            <Select.Option value="ラーメン">ラーメン</Select.Option>
            <Select.Option value="お好み焼き・もんじゃ">
              お好み焼き・もんじゃ
            </Select.Option>
            <Select.Option value="その他">その他</Select.Option>
          </Select>
        </AntForm.Item>
        {/* <AntForm.Item
            className="input-wrap-day"
            label="日程（選択）"
            name="day"
            rules={[{ required: true, message: '日程を選択してください' }]}
            >
            <Select>
                <Select.Option value = '1' >{month2 + 1}月{date}日</Select.Option>
                <Select.Option value = '2'>{month2 + 1}月{date+1}日</Select.Option>
                <Select.Option value = '3'>{month2 + 1}月{date+2}日</Select.Option>
                <Select.Option value = '4'>{month2 + 1}月{date+3}日</Select.Option>
                <Select.Option value = '5'>{month2 + 1}月{date+4}日</Select.Option>
                <Select.Option value = '6'>{month2 + 1}月{date+5}日</Select.Option>
                <Select.Option value = '7'>{month2 + 1}月{date+6}日</Select.Option>
            </Select>
            </AntForm.Item> */}

        <div className="btn-wrap">
          <Button type="primary" htmlType="submit">
            {todo ? 'update' : 'Add'}
          </Button>
        </div>
      </AntForm>

      <style jsx>{`
        .btn-wrap {
          margin-top: 1rem;
          display: flex;
          justify-content: flex-end;
        }
        .input-wrap {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default Form;
