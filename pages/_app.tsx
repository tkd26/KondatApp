import React from 'react';
import { AppProps } from 'next/app';

import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from '@/components/organisms/Layout';

const MyApp = (app: AppProps) => {
  const { Component, pageProps } = app;

  return (
    <>
    <div className='layout'>
    <Layout>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
      <Component {...pageProps} />
    </Layout>
    </div>
    <style>{`
      @import url('https://fonts.googleapis.com/css?family=M+PLUS+1p');
      .layout {
        font-family: 'M PLUS 1p', sans-serif;
      }
    `}</style>
    </>
  );
};

export default MyApp;
