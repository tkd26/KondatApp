import React from 'react';
import { Layout as AntdLayout } from 'antd';
import { Navbar, Nav } from 'react-bootstrap';
import firebase from '@/lib/firebase';

const Layout: React.FC = ({ children }) => (
  <>
    <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="/">らくっく</Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="/top">トップ</Nav.Link>
      <Nav.Link href="/signin">サインイン</Nav.Link>
      <Nav.Link href="/signin" onClick={() => firebase.auth().signOut()}>サインアウト</Nav.Link>
    </Nav>
  </Navbar>

    <AntdLayout style={{ minHeight: '100vh' }}>
      <div style={{ padding: '2.5rem' }}>
        <div className="container">{children}</div>
      </div>
    </AntdLayout>
    <style jsx>{`
      .container {
        margin: 2.5rem 10rem;
      }
    `}</style>
  </>
);

export default Layout;
