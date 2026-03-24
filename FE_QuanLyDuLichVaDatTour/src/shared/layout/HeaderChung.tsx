import { Button, Layout, Menu, Space, Typography } from 'antd'
import { Link, useLocation } from 'react-router'
import { PATHS } from '../../paths'

const { Header } = Layout
const { Text, Title } = Typography

export function HeaderChung() {
  const location = useLocation()

  const items = [
    { key: PATHS.home, label: <Link to={PATHS.home}>Trang chủ</Link> },
    { key: '#tour-noi-bat', label: <a href="#tour-noi-bat">Tour</a> },
    { key: '#lich-khoi-hanh', label: <a href="#lich-khoi-hanh">Lịch khởi hành</a> },
    { key: '#uu-dai', label: <a href="#uu-dai">Tin tức</a> },
    { key: '#tu-van-tour', label: <a href="#tu-van-tour">Liên hệ</a> },
  ]

  const selectedKey = items.some((item) => item.key === location.pathname) ? location.pathname : PATHS.home

  return (
    <Header className="app-header">
      <div className="app-header-inner">
        <Link to={PATHS.home} className="app-brand">
          <span className="app-brand-mark">✈</span>
          <div className="app-brand-text">
            <Title level={2} className="app-brand-title">
              Du Lịch Việt
            </Title>
            <Text className="app-brand-subtitle">Khám phá đất nước</Text>
          </div>
        </Link>

        <Menu mode="horizontal" selectedKeys={[selectedKey]} items={items} className="app-menu" />

        <Space className="app-header-actions">
          <button type="button" className="app-header-icon" aria-label="Yêu thích">
            ♡
          </button>
          <button type="button" className="app-header-icon" aria-label="Thông báo">
            🔔
          </button>
          <Button type="text" className="app-header-link-button" href={PATHS.login}>
            Đăng nhập
          </Button>
          <Button type="primary" className="app-header-button app-header-button-primary" href={PATHS.register}>
            Đăng ký
          </Button>
        </Space>
      </div>
    </Header>
  )
}
