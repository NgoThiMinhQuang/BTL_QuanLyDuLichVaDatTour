import { App, Avatar, Badge, Breadcrumb, Dropdown, Input, Layout, Menu, Typography } from 'antd'
import type { MenuProps } from 'antd'
import {
  AppstoreOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  GiftOutlined,
  LogoutOutlined,
  NotificationOutlined,
  ReadOutlined,
  SearchOutlined,
  StarOutlined,
  TagsOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { PATHS } from '../../constants/paths'
import { useAuthStore } from '../../store/authStore'
import './AdminLayout.css'

const { Sider, Header, Content } = Layout
const { Text, Title } = Typography

const navigationItems: MenuProps['items'] = [
  {
    key: 'dashboard-group',
    type: 'group',
    label: 'Tổng quan',
    children: [
      {
        key: PATHS.admin,
        icon: <AppstoreOutlined />,
        label: <Link to={PATHS.admin}>Bảng điều khiển</Link>,
      },
    ],
  },
  {
    key: 'operations-group',
    type: 'group',
    label: 'Vận hành',
    children: [
      {
        key: PATHS.adminTours,
        icon: <TagsOutlined />,
        label: <Link to={PATHS.adminTours}>Quản lý tour</Link>,
      },
      {
        key: PATHS.adminBookings,
        icon: <TeamOutlined />,
        label: <Link to={PATHS.adminBookings}>Booking</Link>,
      },
      {
        key: PATHS.adminPayments,
        icon: <CreditCardOutlined />,
        label: <Link to={PATHS.adminPayments}>Thanh toán</Link>,
      },
      {
        key: PATHS.adminReviews,
        icon: <StarOutlined />,
        label: <Link to={PATHS.adminReviews}>Duyệt đánh giá</Link>,
      },
    ],
  },
  {
    key: 'catalog-group',
    type: 'group',
    label: 'Danh mục',
    children: [
      {
        key: PATHS.adminLoaiTours,
        icon: <AppstoreOutlined />,
        label: <Link to={PATHS.adminLoaiTours}>Loại tour</Link>,
      },
      {
        key: PATHS.adminDiaDiems,
        icon: <EnvironmentOutlined />,
        label: <Link to={PATHS.adminDiaDiems}>Điểm đi</Link>,
      },
    ],
  },
  {
    key: 'content-group',
    type: 'group',
    label: 'Nội dung & ưu đãi',
    children: [
      {
        key: PATHS.adminTinTucs,
        icon: <ReadOutlined />,
        label: <Link to={PATHS.adminTinTucs}>Tin tức</Link>,
      },
      {
        key: PATHS.adminVouchers,
        icon: <GiftOutlined />,
        label: <Link to={PATHS.adminVouchers}>Voucher</Link>,
      },
    ],
  },
  {
    key: 'schedule-group',
    type: 'group',
    label: 'Lịch trình vận hành',
    children: [
      {
        key: PATHS.adminLichKhoiHanhs,
        icon: <CalendarOutlined />,
        label: <Link to={PATHS.adminLichKhoiHanhs}>Lịch khởi hành</Link>,
      },
      {
        key: PATHS.adminLichTrinhs,
        icon: <FileTextOutlined />,
        label: <Link to={PATHS.adminLichTrinhs}>Lịch trình</Link>,
      },
    ],
  },
]

const breadcrumbLabelMap: Record<string, string> = {
  [PATHS.admin]: 'Tổng quan',
  [PATHS.adminTours]: 'Quản lý tour',
  [PATHS.adminBookings]: 'Booking',
  [PATHS.adminPayments]: 'Thanh toán',
  [PATHS.adminReviews]: 'Duyệt đánh giá',
  [PATHS.adminLoaiTours]: 'Loại tour',
  [PATHS.adminDiaDiems]: 'Điểm đi',
  [PATHS.adminVouchers]: 'Voucher',
  [PATHS.adminTinTucs]: 'Tin tức',
  [PATHS.adminLichKhoiHanhs]: 'Lịch khởi hành',
  [PATHS.adminLichTrinhs]: 'Lịch trình',
}

const menuKeys = Object.values(PATHS).filter((value) => value.startsWith('/admin'))

function getSelectedMenuKey(pathname: string) {
  const sortedKeys = menuKeys.sort((left, right) => right.length - left.length)
  return sortedKeys.find((key) => pathname.startsWith(key)) ?? PATHS.admin
}

function getBreadcrumbItems(pathname: string) {
  const selectedKey = getSelectedMenuKey(pathname)
  if (selectedKey === PATHS.admin) {
    return [{ title: 'Admin' }, { title: 'Tổng quan' }]
  }

  return [{ title: 'Admin' }, { title: breadcrumbLabelMap[selectedKey] ?? 'Quản trị' }]
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
  const navigate = useNavigate()
  const { message } = App.useApp()
  const currentUser = useAuthStore((state) => state.currentUser)
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession)
  const selectedMenuKey = getSelectedMenuKey(location.pathname)

  const userMenuItems = [
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: () => {
        clearAuthSession()
        void message.success('Đã đăng xuất khỏi khu vực quản trị')
        navigate(PATHS.login)
      },
    },
  ]

  return (
    <Layout className="admin-layout-shell">
      <Sider width={300} className="admin-layout-sider" breakpoint="lg" collapsedWidth="0">
        <div className="admin-layout-brand">
          <div className="admin-layout-brand-icon">TA</div>
          <div>
            <Title level={4} className="admin-layout-brand-name">
              TravelAdmin
            </Title>
            <Text className="admin-layout-brand-subtitle">Trung tâm quản trị vận hành</Text>
          </div>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenuKey]}
          items={navigationItems}
          className="admin-layout-menu"
        />

        <div className="admin-layout-user-card">
          <Avatar size={48} className="admin-layout-user-avatar">
            {getInitials(currentUser?.hoTen)}
          </Avatar>
          <div className="admin-layout-user-meta">
            <Text className="admin-layout-user-name">{currentUser?.hoTen || 'Admin User'}</Text>
            <Text className="admin-layout-user-email">{currentUser?.email || 'admin@travel.vn'}</Text>
            <Text className="admin-layout-user-role">{currentUser?.vaiTro || 'admin'}</Text>
          </div>
        </div>
      </Sider>

      <Layout className="admin-layout-main">
        <Header className="admin-layout-header">
          <div className="admin-layout-header-left">
            <Input
              prefix={<SearchOutlined className="admin-layout-search-icon" />}
              placeholder="Tìm nhanh trong khu vực quản trị..."
              className="admin-layout-search"
            />
          </div>

          <div className="admin-layout-header-actions">
            <Badge dot>
              <button type="button" className="admin-layout-bell" aria-label="Thông báo quản trị">
                <NotificationOutlined />
              </button>
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
              <button type="button" className="admin-layout-account-button">
                <Avatar size={40} className="admin-layout-user-avatar admin-layout-user-avatar--header">
                  {getInitials(currentUser?.hoTen)}
                </Avatar>
                <span className="admin-layout-account-text">
                  <strong>{currentUser?.hoTen || 'Admin User'}</strong>
                  <span>{currentUser?.email || 'admin@travel.vn'}</span>
                </span>
              </button>
            </Dropdown>
          </div>
        </Header>

        <Content className="admin-layout-content">
          <div className="admin-layout-breadcrumb-wrap">
            <Breadcrumb items={getBreadcrumbItems(location.pathname)} />
          </div>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
