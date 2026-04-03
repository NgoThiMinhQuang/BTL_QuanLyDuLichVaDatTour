import { Button, Layout, Menu, Space } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router'
import logoImage from '../../assets/image.png'
import { PATHS } from '../../paths'

const { Header } = Layout

export function HeaderChung() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = `${location.pathname}${location.search}`
  const loginPath = currentPath === PATHS.home ? PATHS.login : `${PATHS.login}?redirect=${encodeURIComponent(currentPath)}`
  const registerPath = currentPath === PATHS.home ? PATHS.register : `${PATHS.register}?redirect=${encodeURIComponent(currentPath)}`
  const accessToken = localStorage.getItem('accessToken')
  const currentUserRaw = localStorage.getItem('currentUser')

  let currentUserName = ''

  if (currentUserRaw) {
    try {
      currentUserName = (JSON.parse(currentUserRaw) as { hoTen?: string }).hoTen ?? ''
    } catch {
      currentUserName = ''
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('currentUser')
    navigate(PATHS.home)
  }

  const items = [
    { key: PATHS.home, label: <Link to={PATHS.home}>Trang chủ</Link> },
    { key: PATHS.tour, label: <Link to={PATHS.tour}>Tour</Link> },
    { key: PATHS.lichKhoiHanh, label: <Link to={PATHS.lichKhoiHanh}>Lịch khởi hành</Link> },
    { key: PATHS.tinTuc, label: <Link to={PATHS.tinTuc}>Tin tức</Link> },
    { key: PATHS.lienHe, label: <Link to={PATHS.lienHe}>Liên hệ</Link> },
  ]

  const selectedKey = items.some((item) => item.key === location.pathname) ? location.pathname : PATHS.home

  return (
    <Header className="app-header">
      <div className="app-header-inner">
        <Link to={PATHS.home} className="app-brand">
          <img src={logoImage} alt="TravelViet" className="app-brand-logo" />
        </Link>

        <Menu mode="horizontal" selectedKeys={[selectedKey]} items={items} className="app-menu" />

        <Space className="app-header-actions">
          <button type="button" className="app-header-icon" aria-label="Yêu thích">
            ♡
          </button>
          <button type="button" className="app-header-icon" aria-label="Thông báo">
            🔔
          </button>
          {accessToken ? (
            <>
              <span className="app-header-user-name">{currentUserName || 'Tài khoản của tôi'}</span>
              <Button type="primary" danger className="app-header-button app-header-button-primary" onClick={handleLogout}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button type="text" className="app-header-link-button" href={loginPath}>
                Đăng nhập
              </Button>
              <Button type="primary" className="app-header-button app-header-button-primary" href={registerPath}>
                Đăng ký
              </Button>
            </>
          )}
        </Space>
      </div>
    </Header>
  )
}
