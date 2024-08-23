'use client'
import React from 'react'

import { Layout, theme } from 'antd'

const { Header, Content, Footer } = Layout

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  return (
    <Layout>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: 30 }}>Welcome to Home Page</div>
      </Header>
      <Content
        style={{
          margin: '16px',
        }}
      >
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 25,
          }}
        >
          This is a demo for the Veo Web Developer position test.
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
        ©{new Date().getFullYear()} Created by Ruichao Zhang
      </Footer>
    </Layout>
  )
}
export default App
