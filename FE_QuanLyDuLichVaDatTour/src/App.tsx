import { Button, Layout, Menu, Space, Typography } from 'antd'
import { Link, Route, Routes, useLocation } from 'react-router'
import './App.css'
import About from './pages/About'
import Home from './pages/Home'

const { Header, Content } = Layout
const { Text, Title } = Typography

export default function App() {
  const location = useLocation()

  const items = [
    { key: '/', label: <Link to="/">Trang chủ</Link> },
    { key: '/about', label: <Link to="/about">Giới thiệu</Link> },
  ]

  return (
    <Layout className="app-shell">
      <Header className="app-header">
        <div className="app-brand">
          <Title level={3} className="app-brand-title">
            Du lịch và đặt tour
          </Title>
          <Text className="app-brand-subtitle">
            Thiết kế theo hướng khách hàng và bám sát nghiệp vụ hiện có
          </Text>
        </div>

        <Menu
          mode="horizontal"
          theme="dark"
          selectedKeys={[location.pathname]}
          items={items}
          className="app-menu"
        />

        <Space>
          <Button type="primary" href="#tu-van-tour">
            Tư vấn tour
          </Button>
        </Space>
      </Header>

      <Content className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Content>
    </Layout>
  )
}
