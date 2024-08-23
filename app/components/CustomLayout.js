'use client'
import { useState } from 'react'
import { Layout, Menu } from 'antd'
import {
  GoogleOutlined,
  HomeOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { useRouter } from 'next/navigation'

const { Sider } = Layout
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  }
}
const items = [
  getItem('Home', '1', <HomeOutlined />),
  getItem('Map', '2', <GoogleOutlined />),
  getItem('List', '3', <UnorderedListOutlined />),
]

export default function CustomLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()

  const handleSidebarNavigation = (item) => {
    console.log({ item })

    if (item.key === '1') {
      router.push('/')
    }
    if (item.key === '2') {
      router.push('/map')
    }
    if (item.key === '3') {
      router.push('/list')
    }
  }

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          theme="dark"
          defaultSelectedKeys={['1']}
          mode="inline"
          items={items}
          onSelect={(item) => handleSidebarNavigation(item)}
        />
      </Sider>
      {children}
    </Layout>
  )
}
