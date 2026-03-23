import { Button, Layout, Menu, Space, Typography } from 'antd'
import { Link, useLocation } from 'react-router'
import { PATHS } from '../../paths'

const { Header } = Layout
const { Text, Title } = Typography

export function HeaderChung() {
  const location = useLocation()

  const items = [
    { key: PATHS.home, label: <Link to={PATHS.home}>Trang chủ</Link> },
    { key: PATHS.about, label: <Link to={PATHS.about}>Giới thiệu</Link> },
    { key: '#tour-noi-bat', label: <a href="#tour-noi-bat">Tour</a> },
    { key: '#lich-khoi-hanh', label: <a href="#lich-khoi-hanh">Lịch khởi hành</a> },
    { key: '#danh-muc-tour', label: <a href="#danh-muc-tour">Danh mục</a> },
    { key: '#uu-dai', label: <a href="#uu-dai">Ưu đãi</a> },
    { key: '#tu-van-tour', label: <a href="#tu-van-tour">Liên hệ</a> },
  ]

  const selectedKey = items.some((item) => item.key === location.pathname) ? location.pathname : PATHS.home

  return (
    <Header className="app-header">
      <div className="app-header-inner">
        <Link to={PATHS.home} className="app-brand">
          <span className="app-brand-mark">✈</span>
          <div>
            <Title level={2} className="app-brand-title">
              TravelViet Tour
            </Title>
            <Text className="app-brand-subtitle">Khám phá hành trình đẹp khắp Việt Nam</Text>
          </div>
        </Link>

        <Menu mode="horizontal" selectedKeys={[selectedKey]} items={items} className="app-menu" />

        <Space className="app-header-actions">
          <Button className="app-header-button">Đăng nhập</Button>
          <Button type="primary" className="app-header-button app-header-button-primary">
            Đăng ký
          </Button>
        </Space>
      </div>
    </Header>
  )
}
