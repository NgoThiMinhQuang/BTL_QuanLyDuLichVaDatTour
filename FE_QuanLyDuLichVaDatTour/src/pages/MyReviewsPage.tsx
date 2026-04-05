import './MyReviews/MyReviews.css'
import { Alert, Card, Empty, Skeleton, Space, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { ReviewForm } from '../components/review/ReviewForm'
import { layChiTietBooking } from '../services/booking/booking'
import { layDanhGiaCuaToi } from '../services/review/review'
import { formatDate } from '../utils/formatDate'

const { Paragraph, Text, Title } = Typography

export default function MyReviews() {
  const [searchParams] = useSearchParams()
  const bookingId = Number(searchParams.get('bookingId'))
  const hasBookingId = Number.isInteger(bookingId) && bookingId > 0

  const reviewsQuery = useQuery({
    queryKey: ['my-reviews'],
    queryFn: layDanhGiaCuaToi,
  })

  const bookingQuery = useQuery({
    queryKey: ['review-booking', bookingId],
    queryFn: () => layChiTietBooking(bookingId),
    enabled: hasBookingId,
  })

  return (
    <div className="customer-page">
      <div className="customer-page-container">
        <div className="customer-page-header">
          <Title className="customer-page-title">Đánh giá của tôi</Title>
          <Paragraph className="customer-page-subtitle">Chỉ các booking đã hoàn tất mới có thể gửi đánh giá.</Paragraph>
        </div>

        {bookingQuery.data?.coTheDanhGia ? (
          <Card className="customer-booking-card" variant="borderless">
            <ReviewForm bookingId={bookingQuery.data.id} tenTour={bookingQuery.data.tenTour} onSuccess={() => reviewsQuery.refetch()} />
          </Card>
        ) : null}

        {reviewsQuery.isLoading ? (
          <Space direction="vertical" size={16} className="customer-page-stack">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} active paragraph={{ rows: 4 }} className="customer-page-skeleton" />
            ))}
          </Space>
        ) : null}

        {reviewsQuery.isError ? <Alert type="error" showIcon message={reviewsQuery.error instanceof Error ? reviewsQuery.error.message : 'Không thể tải danh sách đánh giá'} /> : null}

        {!reviewsQuery.isLoading && !reviewsQuery.isError && reviewsQuery.data.length === 0 ? <Empty description="Bạn chưa có đánh giá nào" /> : null}

        {!reviewsQuery.isLoading && !reviewsQuery.isError ? (
          <Space direction="vertical" size={18} className="customer-page-stack">
            {reviewsQuery.data.map((review) => (
              <Card key={review.id} className="customer-booking-card" variant="borderless">
                <Space direction="vertical" size={10} className="customer-booking-card-stack">
                  <div className="customer-booking-card-header">
                    <div>
                      <Title level={4} className="customer-booking-card-title">{review.tenTour}</Title>
                      <Paragraph className="customer-booking-card-code">Booking: {review.maBooking}</Paragraph>
                    </div>
                    <Text>{'★'.repeat(review.soSao)}</Text>
                  </div>
                  <Text>Khởi hành: {formatDate(review.ngayKhoiHanh)} - Kết thúc: {formatDate(review.ngayKetThuc)}</Text>
                  <Paragraph>{review.noiDung}</Paragraph>
                </Space>
              </Card>
            ))}
          </Space>
        ) : null}
      </div>
    </div>
  )
}
