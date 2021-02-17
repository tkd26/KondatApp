import React from 'react';
import { Form as AntForm, Input, Button, Select} from 'antd';

const initialValues = {
  todo: '',
  genre: '',
  day: '',
};

type Props = {
  onSubmit: (todo: string, genre: string, day: string) => Promise<unknown>;
  todo?: string;
  genre?: string;
  day?: string;
};

const KondateForm: React.FC<Props> = ({ onSubmit, todo = initialValues.todo , genre = initialValues.genre, day = initialValues.day}) => {
  const [form] = AntForm.useForm();

  const handleFinish = async ({ todo, genre, day}: typeof initialValues) => {
    await onSubmit(todo, genre, day);
    form.resetFields();
  };
  let today = new Date();
  let date = today.getDate();
  let month = today.getMonth();

  return (
    <>
      <AntForm form={form} initialValues={{ todo, genre, day}} onFinish={handleFinish}>
        <AntForm.Item
          className="input-wrap"
          label="献立　　　　　　"
          name="todo"
          rules={[{ required: true, message: '献立を入力してください' }]}
        >
        <Input placeholder="献立を入力してください" />
        </AntForm.Item>

        <AntForm.Item
            className="input-wrap-genre"
            label="ジャンル（選択）"
            name="genre"
            rules={[{ required: true, message: 'ジャンルを選択してください' }]}
            >
            <Select>
                <Select.Option value = '和食'>和食</Select.Option>
                <Select.Option value = '洋食'>洋食</Select.Option>
                <Select.Option value = 'イタリアン・フレンチ'>イタリアン・フレンチ</Select.Option>
                <Select.Option value = '中華'>中華</Select.Option>
                <Select.Option value = '焼肉・ホルモン'>焼肉・ホルモン</Select.Option>
                <Select.Option value = '韓国料理'>韓国料理</Select.Option>
                <Select.Option value = 'アジア・エスニック料理'>アジア・エスニック料理</Select.Option>
                <Select.Option value = 'ラーメン'>ラーメン</Select.Option>
                <Select.Option value = 'お好み焼き・もんじゃ'>お好み焼き・もんじゃ</Select.Option>
                <Select.Option value = 'その他'>その他</Select.Option>
            </Select>
            </AntForm.Item>

            <AntForm.Item
            className="input-wrap-day"
            label="日程（選択）　　"
            name="day"
            rules={[{ required: true, message: '日程を選択してください' }]}
            >
            <Select>
                <Select.Option value = '2月16日'>{month + 1}月{date}日</Select.Option>
                <Select.Option value = '2月17日'>{month + 1}月{date+1}日</Select.Option>
                <Select.Option value = '2月18日'>{month + 1}月{date+2}日</Select.Option>
                <Select.Option value = '2月19日'>{month + 1}月{date+3}日</Select.Option>
                <Select.Option value = '2月20日'>{month + 1}月{date+4}日</Select.Option>
                <Select.Option value = '2月21日'>{month + 1}月{date+5}日</Select.Option>
                <Select.Option value = '2月22日'>{month + 1}月{date+6}日</Select.Option>
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
