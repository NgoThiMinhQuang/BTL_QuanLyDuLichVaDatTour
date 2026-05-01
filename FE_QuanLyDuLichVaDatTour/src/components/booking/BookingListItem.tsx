import { Button, Card, Space, Tag, Typography } from 'antd'
import { Link } from 'react-router'
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
      <Space orientation="vertical" size={16} className="customer-booking-card-stack">
        <div className="customer-booking-card-header">
          <div>
            <Title level={3} className="customer-booking-card-title">
              {booking.tenTour}
            </Title>
            <Paragraph className="customer-booking-card-code">Mã booking: {booking.maBooking}</Paragraph>
          </div>

          <div className="customer-booking-card-price">
            <Text className="customer-booking-card-price-label">Tổng tiền</Text>
            <Title level={3} className="customer-booking-card-price-value">
              {formatMoney(booking.tongTien)}
            </Title>
          </div>
        </div>

        <div className="customer-booking-meta-grid">
          <div>
            <Text className="customer-booking-meta-label">Ngày đặt</Text>
            <Text className="customer-booking-meta-value">{formatDate(booking.ngayDat)}</Text>
          </div>
          <div>
            <Text className="customer-booking-meta-label">Khởi hành</Text>
            <Text className="customer-booking-meta-value">{formatDate(booking.ngayKhoiHanh)}</Text>
          </div>
          <div>
            <Text className="customer-booking-meta-label">Đợt tour</Text>
            <Text className="customer-booking-meta-value">{booking.maDotTour}</Text>
          </div>
          <div>
            <Text className="customer-booking-meta-label">Hành khách</Text>
            <Text className="customer-booking-meta-value">{booking.tongHanhKhach} người</Text>
          </div>
        </div>

        <Space wrap>
          <Tag color="blue">Booking: {formatTrangThai(booking.trangThaiBooking)}</Tag>
          <Tag color="gold">Thanh toán: {formatTrangThai(booking.trangThaiThanhToan)}</Tag>
          {booking.daDanhGia ? <Tag color="green">Đã đánh giá</Tag> : null}
        </Space>

        <Space wrap>
          <Button type="primary">
            <Link to={PATHS.myBookingDetail.replace(':id', String(booking.id))}>Xem chi tiết</Link>
          </Button>
          {booking.coTheDanhGia ? (
            <Button>
              <Link to={`${PATHS.myReviews}?bookingId=${booking.id}`}>Đánh giá tour</Link>
            </Button>
          ) : null}
        </Space>
      </Space>
    </Card>
  )
}
