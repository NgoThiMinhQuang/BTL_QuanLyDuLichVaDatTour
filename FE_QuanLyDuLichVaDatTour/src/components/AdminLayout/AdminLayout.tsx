import type React from 'react'
import { App, Avatar, Badge, Breadcrumb, Dropdown, Input, Layout, List, Menu, Typography, Spin, Tag } from 'antd'
import type { MenuProps } from 'antd'
import {
  AppstoreOutlined,
  CalendarOutlined,
  CloseCircleOutlined,
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
import { useState, useRef, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAdminDashboardSummary } from '../../services/admin/admin.hooks'
import { layKetQuaTimKiemQuanTri } from '../../services/admin/admin.api'
import { formatMoney } from '../../utils/formatMoney'
import type { GlobalSearchResult } from '../../types/admin'
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
      {
        key: PATHS.adminKhachHangs,
        icon: <TeamOutlined />,
        label: <Link to={PATHS.adminKhachHangs}>Khách hàng</Link>,
      },
      {
        key: PATHS.adminLienHes,
        icon: <NotificationOutlined />,
        label: <Link to={PATHS.adminLienHes}>Liên hệ hỗ trợ</Link>,
      },
      {
        key: PATHS.adminHuyTours,
        icon: <CloseCircleOutlined />,
        label: <Link to={PATHS.adminHuyTours}>Yêu cầu hủy tour</Link>,
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
  [PATHS.adminKhachHangs]: 'Khách hàng',
  [PATHS.adminLienHes]: 'Liên hệ hỗ trợ',
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

  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const searchQuery_ = useQuery({
    queryKey: ['admin', 'global-search', searchQuery],
    queryFn: () => layKetQuaTimKiemQuanTri(searchQuery),
    enabled: searchQuery.length >= 2,
    staleTime: 30000,
  })

  const dashboardQuery = useAdminDashboardSummary()

  const notificationItems: Array<{
    type: 'review' | 'payment' | 'booking'
    id: number
    title: string
    description: string
    url: string
    time?: string
  }> = [
    ...(dashboardQuery.data?.danhGiaChoDuyet?.map((r) => ({
      type: 'review' as const,
      id: r.id,
      title: `Đánh giá mới từ ${r.hoTenKhachHang}`,
      description: r.tenTour,
      url: PATHS.adminReviews,
      time: r.ngayDanhGia,
    })) ?? []),
    ...(dashboardQuery.data?.thanhToanChoXacNhan?.map((p) => ({
      type: 'payment' as const,
      id: p.id,
      title: `Thanh toán chờ xác nhận: ${p.maBooking}`,
      description: `${p.hoTenKhachHang} - ${formatMoney(p.soTien)}`,
      url: PATHS.adminPayments,
    })) ?? []),
    ...(dashboardQuery.data?.bookingMoi?.slice(0, 3).map((b) => ({
      type: 'booking' as const,
      id: b.id,
      title: `Booking mới: ${b.maBooking}`,
      description: `${b.hoTenNguoiDat} - ${b.tenTour}`,
      url: PATHS.adminBookings,
    })) ?? []),
  ]

  const hasNotifications = notificationItems.length > 0

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    if (searchInput.length >= 2) {
      searchTimeout.current = setTimeout(() => setSearchQuery(searchInput), 300)
    } else {
      setSearchQuery('')
    }
  }, [searchInput])

  const getSearchResults = () => {
    if (!searchQuery_) return []
    const r = searchQuery_.data
    if (!r) return []
    return [
      ...(r.tours ?? []),
      ...(r.bookings ?? []),
      ...(r.customers ?? []),
      ...(r.vouchers ?? []),
      ...(r.lichKhoiHanhs ?? []),
      ...(r.tinTucs ?? []),
    ]
  }

  const getGroupedResults = () => {
    const r = searchQuery_.data
    if (!r) return []
    return [
      { module: 'tours', label: 'Tour', items: r.tours ?? [], color: 'blue' },
      { module: 'bookings', label: 'Booking', items: r.bookings ?? [], color: 'green' },
      { module: 'customers', label: 'Khách hàng', items: r.customers ?? [], color: 'purple' },
      { module: 'vouchers', label: 'Voucher', items: r.vouchers ?? [], color: 'orange' },
      { module: 'lich-khoi-hanh', label: 'Lịch khởi hành', items: r.lichKhoiHanhs ?? [], color: 'cyan' },
      { module: 'tin-tuc', label: 'Tin tức', items: r.tinTucs ?? [], color: 'magenta' },
    ].filter((g) => g.items.length > 0)
  }

  const moduleColors: Record<string, string> = {
    tours: 'blue',
    bookings: 'green',
    customers: 'purple',
    vouchers: 'orange',
    'lich-khoi-hanh': 'cyan',
    'tin-tuc': 'magenta',
  }

  const moduleLabels: Record<string, string> = {
    tours: 'Tour',
    bookings: 'Booking',
    customers: 'Khách hàng',
    vouchers: 'Voucher',
    'lich-khoi-hanh': 'Lịch khởi hành',
    'tin-tuc': 'Tin tức',
  }

  const handleSearchClick = (item: GlobalSearchResult) => {
    navigate(item.url)
    setSearchOpen(false)
    setSearchInput('')
    setSearchQuery('')
  }

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
            <div className="admin-global-search">
              <Input
                ref={searchInputRef as React.RefObject<any>}
                prefix={<SearchOutlined className="admin-layout-search-icon" />}
                placeholder="Tìm nhanh: tour, booking, khách hàng..."
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setSearchOpen(true) }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                className="admin-layout-search"
                variant="borderless"
              />
              {searchOpen && searchInput.length >= 2 && (
                <div className="admin-global-search-dropdown">
                  {searchQuery_.isLoading ? (
                    <div className="admin-global-search-loading"><Spin size="small" /> Đang tìm...</div>
                  ) : getSearchResults().length === 0 ? (
                    <div className="admin-global-search-empty">Không tìm thấy kết quả</div>
                  ) : (
                    <>
                      <div className="admin-global-search-count">
                        {searchQuery_.data?.totalCount ?? 0} kết quả cho "{searchInput}"
                      </div>
                      {getGroupedResults().map((group) => (
                        <div key={group.module} className="admin-global-search-group">
                          <div className="admin-global-search-group-header">
                            <Tag color={group.color}>{group.label}</Tag>
                            <Text type="secondary" style={{ fontSize: 11 }}>{group.items.length} kết quả</Text>
                          </div>
                          {group.items.slice(0, 5).map((item, i) => (
                            <div
                              key={`${group.module}-${i}`}
                              className="admin-global-search-item"
                              onClick={() => void handleSearchClick(item)}
                            >
                              <div className="admin-global-search-item-content">
                                <Text>{item.label}</Text>
                                {item.description && <Text type="secondary" style={{ fontSize: 12 }}>{item.description}</Text>}
                              </div>
                              <Text type="secondary" style={{ fontSize: 11 }}>{item.status}</Text>
                            </div>
                          ))}
                          {group.items.length > 5 && (
                            <Text type="secondary" style={{ fontSize: 11, padding: '4px 8px', display: 'block' }}>
                              +{group.items.length - 5} kết quả khác
                            </Text>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="admin-layout-header-actions">
            <Dropdown
              popupRender={() => (
                <div className="admin-notification-panel">
                  <div className="admin-notification-panel-header">
                    <Text strong>Thông báo</Text>
                    <Badge count={notificationItems.length} size="small" />
                  </div>
                  {dashboardQuery.isLoading ? (
                    <div className="admin-notification-loading"><Spin size="small" /></div>
                  ) : notificationItems.length === 0 ? (
                    <div className="admin-notification-empty">Không có thông báo mới</div>
                  ) : (
                    <List
                      size="small"
                      dataSource={notificationItems}
                      renderItem={(item: any) => (
                        <List.Item
                          className="admin-notification-item"
                          onClick={() => navigate(item.url)}
                        >
                          <List.Item.Meta
                            title={<Text style={{ fontSize: 13 }}>{item.title}</Text>}
                            description={<Text type="secondary" style={{ fontSize: 12 }}>{item.description}</Text>}
                          />
                        </List.Item>
                      )}
                    />
                  )}
                </div>
              )}
              trigger={['click']}
              placement="bottomRight"
            >
              <div className="admin-layout-bell-wrapper">
                <Badge dot={hasNotifications} offset={[-2, 2]}>
                  <div className="admin-layout-bell">
                    <NotificationOutlined />
                  </div>
                </Badge>
              </div>
            </Dropdown>
            
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
              <div className="admin-layout-account-button">
                <Avatar size={40} className="admin-layout-user-avatar admin-layout-user-avatar--header">
                  {getInitials(currentUser?.hoTen)}
                </Avatar>
                <div className="admin-layout-account-text">
                  <span className="admin-account-name">{currentUser?.hoTen || 'Admin User'}</span>
                  <span className="admin-account-email">{currentUser?.email || 'admin@travel.vn'}</span>
                </div>
              </div>
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
