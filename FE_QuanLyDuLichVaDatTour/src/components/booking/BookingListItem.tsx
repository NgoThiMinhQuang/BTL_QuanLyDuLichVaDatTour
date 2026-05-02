import { Button, Card, Divider, Space, Tag, Typography } from 'antd'
import { Link } from 'react-router'
import { CalendarOutlined, IdcardOutlined, TagOutlined, TeamOutlined, EyeOutlined, MessageOutlined, CheckCircleOutlined, WalletOutlined } from '@ant-design/icons'
import type { BookingListItem } from '../../services/booking/booking'
import { PATHS } from '../../constants/paths'
import { formatDate } from '../../utils/formatDate'
import { formatMoney } from '../../utils/formatMoney'

const { Paragraph, Text, Title } = Typography

interface BookingListItemProps {
  booking: BookingListItem
}

function formatTrangThai(value: string) {
  return value
    .split('_')
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(' ')
}

export function BookingListItemCard({ booking }: BookingListItemProps) {
  return (
    <Card className="customer-booking-card" variant="borderless">
      <div className="booking-card-main">
        <div className="booking-card-content">
          <div className="booking-card-header-row">
            <div className="booking-card-title-section">
              <Title level={4} className="customer-booking-card-title">
                {booking.tenTour}
              </Title>
              <div className="booking-card-id">
                <IdcardOutlined className="meta-icon" />
                <Text type="secondary">Mã: {booking.maBooking}</Text>
              </div>
            </div>
            
            <div className="booking-card-price-section">
              <Text className="price-label">Tổng thanh toán</Text>
              <Title level={3} className="price-value">
                {formatMoney(booking.tongTien)}
              </Title>
            </div>
          </div>

          <Divider className="booking-card-divider" />

          <div className="booking-card-meta-grid">
            <div className="meta-item">
              <CalendarOutlined className="meta-icon" />
              <div>
                <Text className="meta-label">Ngày đặt</Text>
                <Text className="meta-value">{formatDate(booking.ngayDat)}</Text>
              </div>
            </div>
            <div className="meta-item">
              <CalendarOutlined className="meta-icon" />
              <div>
                <Text className="meta-label">Khởi hành</Text>
                <Text className="meta-value">{formatDate(booking.ngayKhoiHanh)}</Text>
              </div>
            </div>
            <div className="meta-item">
              <TagOutlined className="meta-icon" />
              <div>
                <Text className="meta-label">Đợt tour</Text>
                <Text className="meta-value">{booking.maDotTour}</Text>
              </div>
            </div>
            <div className="meta-item">
              <TeamOutlined className="meta-icon" />
              <div>
                <Text className="meta-label">Hành khách</Text>
                <Text className="meta-value">{booking.tongHanhKhach} người</Text>
              </div>
            </div>
          </div>

          <div className="booking-card-footer">
            <div className="booking-card-status">
              <Tag icon={<CheckCircleOutlined />} color="processing" className="status-tag">
                Booking: {formatTrangThai(booking.trangThaiBooking)}
              </Tag>
              <Tag icon={<WalletOutlined />} color="warning" className="status-tag">
                {formatTrangThai(booking.trangThaiThanhToan)}
              </Tag>
              {booking.daDanhGia && (
                <Tag icon={<CheckCircleOutlined />} color="success" className="status-tag">
                  Đã đánh giá
                </Tag>
              )}
            </div>

            <Space size="middle" className="booking-card-actions">
              <Button type="primary" icon={<EyeOutlined />} className="action-btn view-btn">
                <Link to={PATHS.myBookingDetail.replace(':id', String(booking.id))}>Chi tiết</Link>
              </Button>
              {booking.coTheDanhGia && (
                <Button icon={<MessageOutlined />} className="action-btn review-btn">
                  <Link to={`${PATHS.myReviews}?bookingId=${booking.id}`}>Đánh giá</Link>
                </Button>
              )}
            </Space>
          </div>
        </div>
      </div>
    </Card>
  )
}
