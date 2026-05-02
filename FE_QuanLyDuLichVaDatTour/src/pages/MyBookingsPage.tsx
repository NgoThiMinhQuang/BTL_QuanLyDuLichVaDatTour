import './MyBookingsPage.css'
import { Alert, Empty, Skeleton, Space, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { BookingListItemCard } from '../components/booking/BookingListItem'
import { layDanhSachBookingCuaToi } from '../services/booking/booking'

const { Paragraph, Title } = Typography

export default function MyBookings() {
  const { data = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: layDanhSachBookingCuaToi,
  })

  return (
    <div className="customer-page">
      <div className="customer-page-container">
        <div className="customer-page-header">
          <Title className="customer-page-title">Đơn đã đặt</Title>
          <Paragraph className="customer-page-subtitle">Theo dõi tất cả booking của bạn và truy cập nhanh vào phần đánh giá sau khi chuyến đi hoàn tất.</Paragraph>
        </div>

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
          <Space orientation="vertical" size={24} className="customer-page-stack">
            {data.map((booking) => (
              <BookingListItemCard key={booking.id} booking={booking} />
            ))}
          </Space>
        ) : null}
      </div>
    </div>
  )
}
