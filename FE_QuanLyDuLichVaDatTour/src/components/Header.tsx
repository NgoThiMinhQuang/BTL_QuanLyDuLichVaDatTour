import { Button, Dropdown, Layout, Menu, Space, Avatar } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router'
import { UserOutlined, LogoutOutlined, BookOutlined, StarOutlined, BellOutlined, HeartOutlined, GiftOutlined } from '@ant-design/icons'
import logoImage from '../assets/image.png'
import { PATHS } from '../constants/paths'
import { useAuthStore } from '../store/authStore'

const { Header: AntHeader } = Layout

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = `${location.pathname}${location.search}`
  const loginPath = currentPath === PATHS.home ? PATHS.login : `${PATHS.login}?redirect=${encodeURIComponent(currentPath)}`
  const registerPath = currentPath === PATHS.home ? PATHS.register : `${PATHS.register}?redirect=${encodeURIComponent(currentPath)}`
  const accessToken = useAuthStore((state) => state.accessToken)
  const currentUser = useAuthStore((state) => state.currentUser)
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession)

  const handleLogout = () => {
    clearAuthSession()
    navigate(PATHS.home)
  }

  const navItems = [
    { key: PATHS.home, label: <Link to={PATHS.home}>Trang chủ</Link> },
    { key: PATHS.tour, label: <Link to={PATHS.tour}>Tour</Link> },
    { key: PATHS.lichKhoiHanh, label: <Link to={PATHS.lichKhoiHanh}>Lịch khởi hành</Link> },
    { key: PATHS.tinTuc, label: <Link to={PATHS.tinTuc}>Tin tức</Link> },
    { key: PATHS.lienHe, label: <Link to={PATHS.lienHe}>Liên hệ</Link> },
  ]

  const selectedKey = navItems.some((item) => item.key === location.pathname) ? location.pathname : PATHS.home

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to={PATHS.profile}>Hồ sơ cá nhân</Link>,
    },
    {
      key: 'my-bookings',
      icon: <BookOutlined />,
      label: <Link to={PATHS.myBookings}>Đơn đã đặt</Link>,
    },
    {
      key: 'my-reviews',
      icon: <StarOutlined />,
      label: <Link to={PATHS.myReviews}>Đánh giá của tôi</Link>,
    },
    {
      key: 'my-vouchers',
      icon: <GiftOutlined />,
      label: <Link to={PATHS.myVouchers}>Voucher của tôi</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: handleLogout,
    },
  ]

  return (
    <AntHeader className="app-header">
      <div className="app-header-inner">
        <Link to={PATHS.home} className="app-brand">
          <img src={logoImage} alt="TravelViet" className="app-brand-logo" />
        </Link>

        <Menu mode="horizontal" selectedKeys={[selectedKey]} items={navItems} className="app-menu" />

        <Space size={16} className="app-header-actions">
          <button type="button" className="app-header-icon" aria-label="Yêu thích" onClick={() => navigate(accessToken ? PATHS.favoriteTours : loginPath)}>
            <HeartOutlined />
          </button>
          <button type="button" className="app-header-icon" aria-label="Thông báo">
            <BellOutlined />
          </button>
          
          {accessToken ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']} arrow>
              <div className="app-header-user-profile">
                <Avatar style={{ backgroundColor: '#2563eb' }} icon={<UserOutlined />} />
                <span className="app-header-user-name">{currentUser?.hoTen || 'Tài khoản'}</span>
              </div>
            </Dropdown>
          ) : (
            <Space size={12}>
              <Button type="default" className="app-header-button app-header-button-outline" href={loginPath}>
                Đăng nhập
              </Button>
              <Button type="primary" className="app-header-button app-header-button-cta" href={registerPath}>
                Đăng ký
              </Button>
            </Space>
          )}
        </Space>
      </div>
    </AntHeader>
  )
}
