'use client'
import { useState } from 'react'
import { Layout, Menu } from 'antd'
import {
  GoogleOutlined,
  HomeOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { useRouter, usePathname } from 'next/navigation'

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
  getItem('Home', '/', <HomeOutlined />),
  getItem('Map', '/map', <GoogleOutlined />),
  getItem('List', '/list', <UnorderedListOutlined />),
]

export default function CustomLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

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
          selectedKeys={[pathname]}
          mode="inline"
          items={items}
          onSelect={(item) => router.push(item.key)}
        />
      </Sider>
      {children}
    </Layout>
  )
}
