import './MyBookingsPage.css'
import { Alert, Empty, Select, Space, Typography, Radio, Button } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { BookingListItemCard } from '../components/booking/BookingListItem'
import { layDanhSachBookingCuaToi } from '../services/booking/booking'
import { API_BASE_URL } from '../constants/api'
import { useAuthStore } from '../store/authStore'

const { Paragraph, Title } = Typography

const STATUS_OPTIONS = [
  { label: 'Tất cả', value: '' },
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

  const { data = [], isLoading, isError, error, refetch } = useQuery({
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

  return (
    <div className="customer-page">
      <div className="customer-page-container">
        <div className="customer-page-header">
          <Title className="customer-page-title">Đơn đã đặt</Title>
          <Paragraph className="customer-page-subtitle">Theo dõi tất cả booking của bạn và truy cập nhanh vào phần đánh giá sau khi chuyến đi hoàn tất.</Paragraph>
        </div>

        <Space wrap style={{ marginBottom: 24 }}>
          <Select
            placeholder="Trạng thái"
            allowClear
            style={{ width: 180 }}
            value={status || undefined}
            onChange={(val) => setStatus(val || '')}
            options={STATUS_OPTIONS}
          />
          <Radio.Group value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <Radio.Button value="ngayDat">Ngày đặt</Radio.Button>
            <Radio.Button value="tongTien">Tổng tiền</Radio.Button>
            <Radio.Button value="ngayKhoiHanh">Ngày khởi hành</Radio.Button>
          </Radio.Group>
          <Button
            icon={ascending ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            onClick={() => setAscending(!ascending)}
          >
            {ascending ? 'Tăng dần' : 'Giảm dần'}
          </Button>
        </Space>

        {isLoading ? (
          <Space orientation="vertical" size={16} className="customer-page-stack">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} active paragraph={{ rows: 5 }} className="customer-page-skeleton" />
            ))}
          </Space>
        ) : null}

        {isError ? (
          <Alert
            type="error"
            showIcon
            title={error instanceof Error ? error.message : 'Không thể tải danh sách booking'}
            action={<button type="button" className="customer-page-retry" onClick={() => refetch()}>Thử lại</button>}
          />
        ) : null}

        {!isLoading && !isError && data.length === 0 ? (
          <div className="empty-state-container">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<Text type="secondary" style={{ fontSize: '16px' }}>Bạn chưa có booking nào. Hãy khám phá các tour hấp dẫn của chúng tôi!</Text>}
            />
          </div>
        ) : null}

        {!isLoading && !isError ? (
          <Space orientation="vertical" size={16} className="customer-page-stack">
            {data.map((booking: any) => (
              <BookingListItemCard key={booking.id} booking={booking} />
            ))}
          </Space>
        ) : null}
      </div>
    </div>
  )
}