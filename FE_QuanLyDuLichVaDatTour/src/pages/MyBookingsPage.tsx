import './MyBookingsPage.css'
import { Alert, Empty, Select, Typography, Radio, Button, Skeleton } from 'antd'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  HistoryOutlined,
  CalendarOutlined,
  WalletOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useState, useMemo } from 'react'
import { BookingListItemCard } from '../components/booking/BookingListItem'
import { API_BASE_URL } from '../constants/api'
import { useAuthStore } from '../store/authStore'
import { formatMoney } from '../utils/formatMoney'

const { Paragraph, Title, Text } = Typography

const STATUS_OPTIONS = [
  { label: 'Tất cả trạng thái', value: '' },
  { label: 'Mới tạo', value: 'moi_tao' },
  { label: 'Chờ thanh toán', value: 'cho_thanh_toan' },
  { label: 'Đã cọc', value: 'da_coc' },
  { label: 'Đã xác nhận', value: 'da_xac_nhan' },
  { label: 'Đã hủy', value: 'da_huy' },
  { label: 'Hoàn tất', value: 'hoan_tat' },
]

export default function MyBookings() {
  const [status, setStatus] = useState('')
  const [sortBy, setSortBy] = useState('ngayDat')
  const [ascending, setAscending] = useState(false)

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['my-bookings', status, sortBy, ascending],
    queryFn: async () => {
      const token = useAuthStore.getState().accessToken
      const params = new URLSearchParams()
      if (status) params.set('status', status)
      params.set('sortBy', sortBy)
      params.set('ascending', String(ascending))
      const response = await fetch(`${API_BASE_URL}/booking/my-bookings?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.status === 401) throw new Error('Phiên đăng nhập đã hết hạn.')
      const json = await response.json().catch(() => null)
      if (!response.ok) throw new Error(json?.message || 'Không thể tải danh sách booking')
      return json
    },
  })

  const stats = useMemo(() => {
    if (!data || data.length === 0) return { total: 0, upcoming: 0, pending: 0, totalSpent: 0 }

    const now = new Date()
    return data.reduce(
      (acc: any, booking: any) => {
        acc.total += 1
        const ngayKhoiHanh = new Date(booking.ngayKhoiHanh)
        if (ngayKhoiHanh > now && booking.trangThaiBooking !== 'da_huy') {
          acc.upcoming += 1
        }
        if (booking.trangThaiThanhToan === 'cho_thanh_toan' || booking.trangThaiThanhToan === 'chua_thanh_toan') {
          acc.pending += 1
        }
        if (booking.trangThaiBooking === 'hoan_tat' || booking.trangThaiBooking === 'da_xac_nhan') {
          acc.totalSpent += booking.tongTien
        }
        return acc
      },
      { total: 0, upcoming: 0, pending: 0, totalSpent: 0 }
    )
  }, [data])

  return (
    <div className="customer-page">
      <div className="customer-page-container">
        <div className="customer-page-header">
          <Title className="customer-page-title">Đơn đã đặt</Title>
          <Paragraph className="customer-page-subtitle">
            Quản lý hành trình của bạn, theo dõi trạng thái thanh toán và lưu giữ những kỷ niệm tuyệt vời.
          </Paragraph>
        </div>

        {/* Stats Section */}
        <div className="bookings-stats-grid">
          <div className="stat-card stat-blue">
            <div className="stat-icon">
              <HistoryOutlined />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Tổng số đơn</span>
            </div>
          </div>
          <div className="stat-card stat-orange">
            <div className="stat-icon">
              <CalendarOutlined />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.upcoming}</span>
              <span className="stat-label">Sắp khởi hành</span>
            </div>
          </div>
          <div className="stat-card stat-purple">
            <div className="stat-icon">
              <WalletOutlined />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Chờ thanh toán</span>
            </div>
          </div>
          <div className="stat-card stat-green">
            <div className="stat-icon">
              <CheckCircleOutlined />
            </div>
            <div className="stat-info">
              <span className="stat-value">{formatMoney(stats.totalSpent)}</span>
              <span className="stat-label">Tổng chi tiêu</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bookings-toolbar">
          <div className="toolbar-left">
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: 200 }}
              value={status || undefined}
              onChange={(val) => setStatus(val || '')}
              options={STATUS_OPTIONS}
              className="premium-select"
            />
            <Radio.Group value={sortBy} onChange={(e) => setSortBy(e.target.value)} buttonStyle="solid">
              <Radio.Button value="ngayDat">Ngày đặt</Radio.Button>
              <Radio.Button value="tongTien">Tổng tiền</Radio.Button>
              <Radio.Button value="ngayKhoiHanh">Ngày khởi hành</Radio.Button>
            </Radio.Group>
          </div>
          <div className="toolbar-right">
            <Button
              icon={ascending ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              onClick={() => setAscending(!ascending)}
              className="premium-sort-btn"
            >
              {ascending ? 'Tăng dần' : 'Giảm dần'}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="customer-page-stack">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="skeleton-card" style={{ marginBottom: 20 }}>
                <Skeleton active avatar={{ size: 40 }} paragraph={{ rows: 4 }} />
              </div>
            ))}
          </div>
        ) : null}

        {isError ? (
          <Alert
            type="error"
            showIcon
            message={error instanceof Error ? error.message : 'Không thể tải danh sách booking'}
            action={
              <Button type="primary" size="small" onClick={() => refetch()}>
                Thử lại
              </Button>
            }
          />
        ) : null}

        {!isLoading && !isError && data.length === 0 ? (
          <div className="empty-state-container">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Text type="secondary" style={{ fontSize: '16px' }}>
                  Bạn chưa có đơn đặt nào phù hợp với điều kiện lọc.
                </Text>
              }
            />
          </div>
        ) : null}

        {!isLoading && !isError && data.length > 0 ? (
          <div className="customer-page-stack">
            {data.map((booking: any) => (
              <BookingListItemCard key={booking.id} booking={booking} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}