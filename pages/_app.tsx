import React from 'react';
import { AppProps } from 'next/app';

import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from '@/components/organisms/Layout';

const MyApp = (app: AppProps) => {
  const { Component, pageProps } = app;

  return (
    <Layout>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
