import { Layout, Menu, Typography } from 'antd'
import { Link, Routes, Route, useLocation } from 'react-router'
import Home from './pages/Home'
import About from './pages/About'

const { Header, Content } = Layout
const { Title } = Typography

export default function App() {
  const location = useLocation()

  const items = [
    { key: '/', label: <Link to="/">Home</Link> },
    { key: '/about', label: <Link to="/about">About</Link> },
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          React Starter
        </Title>

        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>

      <Content style={{ padding: 24 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Content>
    </Layout>
  )
}