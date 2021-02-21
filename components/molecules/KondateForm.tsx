import React from 'react';
import { Form as AntForm, Input, Button, Select, Radio } from 'antd';

const initialValues = {
  todo: '',
  genre: '',
  day: 0,
  month: 0,
  year: 0,
  when: '',
};

type Props = {
  onSubmit: (
    todo: string,
    genre: string,
    day: number,
    month: number,
    year: number,
    when: string
  ) => Promise<unknown>;
  todo?: string;
  genre?: string;
  day?: number;
  month?: number;
  year?: number;
  when?: string;
};

const KondateForm: React.FC<Props> = ({
  onSubmit,
  todo = initialValues.todo,
  genre = initialValues.genre,
  day = initialValues.day,
  month = initialValues.month,
  year = initialValues.year,
  when = initialValues.when,
}) => {
  const [form] = AntForm.useForm();
  const [value, setValue] = React.useState(1);

  const onChange = ({ e }: { e: any }) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  const handleFinish = async ({
    todo,
    genre,
    day,
    month,
    year,
    when,
  }: typeof initialValues) => {
    await onSubmit(todo, genre, day, month, year, when);
    form.resetFields();
  };
  const today = new Date();
  const date = today.getDate();
  const month2 = today.getMonth();

  return (
    <>
      <AntForm
        form={form}
        initialValues={{ todo, genre, day: '' }}
        onFinish={handleFinish}
      >
        <AntForm.Item
          className="input-wrap"
          label="献立　　　　　　"
          name="todo"
          rules={[{ required: true, message: '献立を入力してください' }]}
        >
          <Input placeholder="献立を入力してください" />
        </AntForm.Item>
        <AntForm.Item
          className="input-wrap"
          label="朝昼晩　　　　　 "
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
          {/* <Radio.Group value = 'when'>
                <Radio value = {1}>朝ご飯</Radio>
                <Radio value = {2}>昼ご飯</Radio>
                <Radio value = {3}>夜ご飯</Radio>
            </Radio.Group> */}
        </AntForm.Item>

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

        <AntForm.Item
          className="input-wrap-day"
          label="日程（選択）　　"
          name="day"
          rules={[{ required: true, message: '日程を選択してください' }]}
        >
          <Select>
            <Select.Option value="1">
              {month2 + 1}月{date}日
            </Select.Option>
            <Select.Option value="2">
              {month2 + 1}月{date + 1}日
            </Select.Option>
            <Select.Option value="3">
              {month2 + 1}月{date + 2}日
            </Select.Option>
            <Select.Option value="4">
              {month2 + 1}月{date + 3}日
            </Select.Option>
            <Select.Option value="5">
              {month2 + 1}月{date + 4}日
            </Select.Option>
            <Select.Option value="6">
              {month2 + 1}月{date + 5}日
            </Select.Option>
            <Select.Option value="7">
              {month2 + 1}月{date + 6}日
            </Select.Option>
          </Select>
          {/* <input type = 'date' name = 'day'></input> */}
        </AntForm.Item>

        <div className="btn-wrap">
          <Button type="primary" htmlType="submit">
            {todo ? 'update' : '登録'}
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

export default KondateForm;
