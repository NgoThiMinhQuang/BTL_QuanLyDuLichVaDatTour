import { Button, Card, Divider, Space, Tag, Typography } from 'antd'
import { useNavigate } from 'react-router'
import { CalendarOutlined, IdcardOutlined, TagOutlined, TeamOutlined, EyeOutlined, MessageOutlined, CheckCircleOutlined, WalletOutlined } from '@ant-design/icons'
import type { BookingListItem } from '../../services/booking/booking'
import { PATHS } from '../../constants/paths'
import { formatDate } from '../../utils/formatDate'
import { formatMoney } from '../../utils/formatMoney'
import { formatBookingStatus, formatPaymentStatus } from '../../utils/admin'

const { Paragraph, Text, Title } = Typography

interface BookingListItemProps {
  booking: BookingListItem
}

function formatTrangThai(value: string) {
  return formatBookingStatus(value)
}

function formatPaymentTrangThai(value: string) {
  return formatPaymentStatus(value)
}

export function BookingListItemCard({ booking }: BookingListItemProps) {
  const navigate = useNavigate()

  return (
    <div className="customer-booking-card">
      <div className="booking-card-inner">
        <div className="booking-card-visual" />
        <div className="booking-card-content">
          <div className="booking-card-top">
            <div className="booking-info-main">
              <Title level={4} className="booking-tour-name">
                {booking.tenTour}
              </Title>
              <div className="booking-meta-id">
                <IdcardOutlined />
                <span>Mã: {booking.maBooking}</span>
              </div>
            </div>

            <div className="booking-price-tag">
              <span className="price-amount">{formatMoney(booking.tongTien)}</span>
              <span className="price-label">Tổng thanh toán</span>
            </div>
          </div>

          <div className="booking-details-grid">
            <div className="detail-item">
              <span className="detail-label">
                <CalendarOutlined /> Ngày đặt
              </span>
              <span className="detail-value">{formatDate(booking.ngayDat)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <CalendarOutlined /> Khởi hành
              </span>
              <span className="detail-value">{formatDate(booking.ngayKhoiHanh)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <TagOutlined /> Đợt tour
              </span>
              <span className="detail-value">{booking.maDotTour}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <TeamOutlined /> Hành khách
              </span>
              <span className="detail-value">{booking.tongHanhKhach} người</span>
            </div>
          </div>

          <div className="booking-card-bottom">
            <div className="status-group">
              <Tag className={`custom-status-tag status-booking-${booking.trangThaiBooking}`}>
                Booking: {formatTrangThai(booking.trangThaiBooking)}
              </Tag>
              <Tag className={`custom-status-tag status-payment-${booking.trangThaiThanhToan}`}>
                Thanh toán: {formatPaymentTrangThai(booking.trangThaiThanhToan)}
              </Tag>
              {booking.daDanhGia && (
                <Tag color="success" className="custom-status-tag">
                  Đã đánh giá
                </Tag>
              )}
            </div>

            <div className="action-buttons">
              <Button type="primary" icon={<EyeOutlined />} className="btn-premium btn-view" onClick={() => navigate(PATHS.myBookingDetail.replace(':id', String(booking.id)))}>
                Chi tiết
              </Button>
              {booking.coTheDanhGia && (
                <Button icon={<MessageOutlined />} className="btn-premium btn-review" onClick={() => navigate(`${PATHS.myReviews}?bookingId=${booking.id}`)}>
                  Đánh giá
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
