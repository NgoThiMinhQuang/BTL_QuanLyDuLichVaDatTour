import './MyReviewsPage.css'
import { Alert, Card, Divider, Empty, Rate, Skeleton, Space, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'
import { CalendarOutlined, IdcardOutlined, MessageOutlined, StarFilled } from '@ant-design/icons'
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
          <Paragraph className="customer-page-subtitle">
            Chỉ các booking đã hoàn tất mới có thể gửi đánh giá. Chia sẻ trải nghiệm của bạn để giúp chúng tôi cải thiện dịch vụ.
          </Paragraph>
        </div>

        {bookingQuery.data?.coTheDanhGia ? (
          <Card className="customer-booking-card review-form-card" variant="borderless">
            <ReviewForm bookingId={bookingQuery.data.id} tenTour={bookingQuery.data.tenTour} onSuccess={() => reviewsQuery.refetch()} />
          </Card>
        ) : null}

        {reviewsQuery.isLoading ? (
          <Space orientation="vertical" size={16} className="customer-page-stack">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} active paragraph={{ rows: 4 }} className="customer-page-skeleton" />
            ))}
          </Space>
        ) : null}

        {reviewsQuery.isError ? (
          <Alert 
            type="error" 
            showIcon 
            title={reviewsQuery.error instanceof Error ? reviewsQuery.error.message : 'Không thể tải danh sách đánh giá'} 
          />
        ) : null}

        {!reviewsQuery.isLoading && !reviewsQuery.isError && reviewsQuery.data.length === 0 ? (
          <div className="empty-state-container">
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<Text type="secondary" style={{ fontSize: '16px' }}>Bạn chưa có đánh giá nào.</Text>} 
            />
          </div>
        ) : null}

        {!reviewsQuery.isLoading && !reviewsQuery.isError ? (
          <Space orientation="vertical" size={16} className="customer-page-stack">
            {reviewsQuery.data.map((review) => (
              <Card key={review.id} className="customer-booking-card" variant="borderless">
                <div className="review-card-main">
                  <div className="review-card-header">
                    <div className="review-card-title-section">
                      <Title level={4} className="customer-booking-card-title">
                        {review.tenTour}
                      </Title>
                      <div className="booking-card-id">
                        <IdcardOutlined className="meta-icon" />
                        <Text type="secondary">Booking: {review.maBooking}</Text>
                      </div>
                    </div>
                    <div className="review-card-rating">
                      <Rate disabled defaultValue={review.soSao} className="custom-rate" />
                    </div>
                  </div>

                  <Divider className="booking-card-divider" />

                  <div className="review-card-meta">
                    <div className="meta-item">
                      <CalendarOutlined className="meta-icon" />
                      <Text className="meta-value">
                        {formatDate(review.ngayKhoiHanh)} - {formatDate(review.ngayKetThuc)}
                      </Text>
                    </div>
                  </div>

                  <div className="review-card-content">
                    <div className="comment-bubble">
                      <MessageOutlined className="comment-icon" />
                      <Paragraph className="comment-text">{review.noiDung}</Paragraph>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </Space>
        ) : null}
      </div>
    </div>
  )
}
