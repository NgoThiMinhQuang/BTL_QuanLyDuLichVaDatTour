import { Avatar, Badge, Input, Layout, Menu, Typography } from 'antd'
import { Link, Outlet, useLocation } from 'react-router'
import { PATHS } from '../../constants/paths'
import { useAuthStore } from '../../store/authStore'
import './AdminLayout.css'

const { Sider, Header, Content } = Layout
const { Text } = Typography

const navigationItems = [
  { key: PATHS.admin, label: <Link to={PATHS.admin}>Tổng quan</Link> },
  { key: PATHS.adminTours, label: <Link to={PATHS.adminTours}>Quản lý tour</Link> },
]

function getSelectedMenuKey(pathname: string) {
  if (pathname.startsWith(PATHS.adminTours)) {
    return PATHS.adminTours
  }

  return PATHS.admin
}

function getInitials(name?: string | null) {
  if (!name) {
    return 'AD'
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export default function AdminLayout() {
  const location = useLocation()
  const currentUser = useAuthStore((state) => state.currentUser)

  return (
    <Layout className="admin-layout-shell">
      <Sider width={268} className="admin-layout-sider">
        <div className="admin-layout-brand">
          <div className="admin-layout-brand-icon">◉</div>
          <Text className="admin-layout-brand-name">TravelAdmin</Text>
        </div>

        <Menu theme="dark" mode="inline" selectedKeys={[getSelectedMenuKey(location.pathname)]} items={navigationItems} className="admin-layout-menu" />

        <div className="admin-layout-user-card">
          <Avatar size={44} className="admin-layout-user-avatar">
            {getInitials(currentUser?.hoTen)}
          </Avatar>
          <div>
            <Text className="admin-layout-user-name">{currentUser?.hoTen || 'Admin User'}</Text>
            <Text className="admin-layout-user-email">{currentUser?.email || 'admin@travel.vn'}</Text>
          </div>
        </div>
      </Sider>

      <Layout className="admin-layout-main">
        <Header className="admin-layout-header">
          <Input prefix={<span className="admin-layout-search-icon">⌕</span>} placeholder="Tìm kiếm..." className="admin-layout-search" />
          <Badge dot>
            <button type="button" className="admin-layout-bell">
              🔔
            </button>
          </Badge>
        </Header>

        <Content className="admin-layout-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
