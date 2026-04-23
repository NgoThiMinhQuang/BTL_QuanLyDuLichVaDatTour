import { Avatar, Breadcrumb, Dropdown, Layout, Menu, Space, Typography } from 'antd'
import type { MenuProps } from 'antd'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { PATHS } from '../../constants/paths'
import { useAuthStore } from '../../store/authStore'
import './AdminLayout.css'

const { Header, Sider, Content } = Layout
const { Text, Title } = Typography

const navigationItems = [
  {
    key: PATHS.admin,
    label: <Link to={PATHS.admin}>Dashboard</Link>,
  },
  {
    key: PATHS.adminTours,
    label: <Link to={PATHS.adminTours}>Quản lý tour</Link>,
  },
]

function getPageMeta(pathname: string) {
  if (pathname.startsWith(PATHS.adminTours)) {
    return {
      title: 'Quản lý tour',
      breadcrumb: ['Quản trị', 'Tour'],
    }
  }

  return {
    title: 'Dashboard',
    breadcrumb: ['Quản trị', 'Dashboard'],
  }
}

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

  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)

  if (parts.length === 0) {
    return 'AD'
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('')
}

export default function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentUser = useAuthStore((state) => state.currentUser)
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession)
  const pageMeta = getPageMeta(location.pathname)

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      label: 'Đăng xuất',
      onClick: () => {
        clearAuthSession()
        navigate(PATHS.login, { replace: true })
      },
    },
  ]

  return (
    <Layout className="admin-shell">
      <Sider breakpoint="lg" collapsedWidth="0" width={260} className="admin-sider">
        <div className="admin-brand">
          <div className="admin-brand-mark">TV</div>
          <div>
            <Text className="admin-brand-name">Travel Viet</Text>
            <Text className="admin-brand-desc">Quản trị hệ thống</Text>
          </div>
        </div>

        <Menu theme="dark" mode="inline" selectedKeys={[getSelectedMenuKey(location.pathname)]} items={navigationItems} className="admin-menu" />
      </Sider>

      <Layout>
        <Header className="admin-header-bar">
          <div>
            <Breadcrumb items={pageMeta.breadcrumb.map((title) => ({ title }))} className="admin-breadcrumb" />
            <Title level={3} className="admin-header-title">
              {pageMeta.title}
            </Title>
          </div>

          <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
            <button type="button" className="admin-user-button">
              <Space size={12}>
                <Avatar size={40} className="admin-user-avatar">
                  {getInitials(currentUser?.hoTen)}
                </Avatar>
                <Space direction="vertical" size={0}>
                  <Text className="admin-user-name">{currentUser?.hoTen || 'Quản trị viên'}</Text>
                  <Text className="admin-user-role">{currentUser?.vaiTro || 'admin'}</Text>
                </Space>
              </Space>
            </button>
          </Dropdown>
        </Header>

        <Content className="admin-page-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
