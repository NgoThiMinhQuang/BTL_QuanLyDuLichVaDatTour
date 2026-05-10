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
  const getBookingStatusText = (status: string) => {
    const map: Record<string, string> = {
      moi_tao: 'Mới tạo',
      cho_thanh_toan: 'Chờ thanh toán',
      da_coc: 'Đã cọc',
      da_xac_nhan: 'Đã xác nhận',
      da_huy: 'Đã hủy',
      hoan_tat: 'Hoàn tất',
    }
    return map[status] || status
  }

  const getPaymentStatusText = (status: string) => {
    const map: Record<string, string> = {
      chua_thanh_toan: 'Chưa thanh toán',
      cho_thanh_toan: 'Chờ thanh toán',
      da_thanh_toan_coc: 'Đã cọc',
      da_thanh_toan_het: 'Đã thanh toán hết',
    }
    return map[status] || status
  }

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
                Booking: {getBookingStatusText(booking.trangThaiBooking)}
              </Tag>
              <Tag className={`custom-status-tag status-payment-${booking.trangThaiThanhToan}`}>
                Thanh toán: {getPaymentStatusText(booking.trangThaiThanhToan)}
              </Tag>
              {booking.daDanhGia && (
                <Tag color="success" className="custom-status-tag">
                  Đã đánh giá
                </Tag>
              )}
            </div>

            <div className="action-buttons">
              <Button type="primary" icon={<EyeOutlined />} className="btn-premium btn-view">
                <Link to={PATHS.myBookingDetail.replace(':id', String(booking.id))} style={{ color: 'inherit' }}>
                  Chi tiết
                </Link>
              </Button>
              {booking.coTheDanhGia && (
                <Button icon={<MessageOutlined />} className="btn-premium btn-review">
                  <Link to={`${PATHS.myReviews}?bookingId=${booking.id}`} style={{ color: 'inherit' }}>
                    Đánh giá
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
