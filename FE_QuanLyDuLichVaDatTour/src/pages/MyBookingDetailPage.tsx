import './MyBookingDetailPage.css'
import { Alert, Card, Empty, List, Skeleton, Space, Tag, Typography, Row, Col, Divider, Steps, Button } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  IdcardOutlined, 
  CreditCardOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { PATHS } from '../constants/paths'
import { formatDate } from '../utils/formatDate'
import { formatMoney } from '../utils/formatMoney'
import { layChiTietBooking, layThanhToanTheoBooking } from '../services/booking/booking'

const { Paragraph, Title, Text } = Typography

function formatTrangThai(value: string) {
  return value
    .split('_')
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(' ')
}

export default function BookingDetail() {
  const params = useParams()
  const bookingId = Number(params.id)
  const isValidBookingId = Number.isInteger(bookingId) && bookingId > 0

  const bookingQuery = useQuery({
    queryKey: ['booking-detail', bookingId],
    queryFn: () => layChiTietBooking(bookingId),
    enabled: isValidBookingId,
  })

  const paymentQuery = useQuery({
    queryKey: ['booking-payments', bookingId],
    queryFn: () => layThanhToanTheoBooking(bookingId),
    enabled: isValidBookingId,
  })

  if (!isValidBookingId) {
    return (
      <div className="customer-page">
        <div className="customer-page-container">
          <Empty description="Booking không hợp lệ" />
        </div>
      </div>
    )
  }

  return (
    <div className="customer-page">
      <div className="customer-page-container">
        <div className="customer-page-header">
          <Title className="customer-page-title">Chi tiết booking</Title>
          <Paragraph className="customer-page-subtitle">Xem đầy đủ thông tin booking, hành khách và lịch sử thanh toán của bạn.</Paragraph>
        </div>

        {bookingQuery.isLoading ? <Skeleton active paragraph={{ rows: 10 }} /> : null}
        {bookingQuery.isError ? <Alert type="error" showIcon title={bookingQuery.error instanceof Error ? bookingQuery.error.message : 'Không thể tải chi tiết booking'} /> : null}

        {bookingQuery.data ? (
          <div className="booking-detail-content">
            {/* 1. Header Card with Status and Code */}
            <Card className="booking-status-card" variant="borderless">
              <div className="booking-status-flex">
                <div className="booking-main-info">
                  <div className="booking-label-row">
                    <Text className="booking-id-pill">#{bookingQuery.data.maBooking}</Text>
                    <Text className="booking-date-label">Đặt ngày: {formatDate(bookingQuery.data.ngayDat)}</Text>
                  </div>
                  <Title level={2} className="booking-tour-title">{bookingQuery.data.tenTour}</Title>
                </div>
                <div className="booking-status-group">
                  <div className="status-item">
                    <Text className="status-label">Trạng thái booking</Text>
                    <Tag color={bookingQuery.data.trangThaiBooking === 'hoan_tat' ? 'success' : 'processing'} className="status-tag">
                      {formatTrangThai(bookingQuery.data.trangThaiBooking)}
                    </Tag>
                  </div>
                  <div className="status-item">
                    <Text className="status-label">Thanh toán</Text>
                    <Tag color={bookingQuery.data.trangThaiThanhToan === 'da_thanh_toan' ? 'success' : 'warning'} className="status-tag">
                      {formatTrangThai(bookingQuery.data.trangThaiThanhToan)}
                    </Tag>
                  </div>
                </div>
              </div>
            </Card>

            <Row gutter={[24, 24]}>
              {/* 2. Tour Details Card */}
              <Col xs={24} lg={16}>
                <div className="booking-sections-stack">
                  <Card className="booking-info-card" variant="borderless" title={<span><CalendarOutlined /> Thông tin chuyến đi</span>}>
                    <Row gutter={[24, 24]}>
                      <Col xs={24} sm={12}>
                        <div className="info-item">
                          <Text className="info-label">Mã đợt tour</Text>
                          <Text strong className="info-value">{bookingQuery.data.maDotTour}</Text>
                        </div>
                        <div className="info-item">
                          <Text className="info-label">Khởi hành</Text>
                          <Text strong className="info-value">{formatDate(bookingQuery.data.ngayKhoiHanh)}</Text>
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div className="info-item">
                          <Text className="info-label">Kết thúc</Text>
                          <Text strong className="info-value">{formatDate(bookingQuery.data.ngayKetThuc)}</Text>
                        </div>
                        <div className="info-item">
                          <Text className="info-label">Địa điểm</Text>
                          <Text strong className="info-value">{bookingQuery.data.diaChiLienHe || 'Theo lịch trình'}</Text>
                        </div>
                      </Col>
                    </Row>
                  </Card>

                  <Card className="booking-info-card" variant="borderless" title={<span><UserOutlined /> Thông tin liên hệ</span>}>
                    <Row gutter={[24, 24]}>
                      <Col xs={24} sm={12}>
                        <div className="info-item-flex">
                          <div className="info-icon-box"><UserOutlined /></div>
                          <div className="info-text-group">
                            <Text className="info-label">Người liên hệ</Text>
                            <Text strong>{bookingQuery.data.hoTenLienHe}</Text>
                          </div>
                        </div>
                        <div className="info-item-flex">
                          <div className="info-icon-box"><MailOutlined /></div>
                          <div className="info-text-group">
                            <Text className="info-label">Email</Text>
                            <Text strong>{bookingQuery.data.emailLienHe}</Text>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div className="info-item-flex">
                          <div className="info-icon-box"><PhoneOutlined /></div>
                          <div className="info-text-group">
                            <Text className="info-label">Số điện thoại</Text>
                            <Text strong>{bookingQuery.data.soDienThoaiLienHe}</Text>
                          </div>
                        </div>
                        <div className="info-item-flex">
                          <div className="info-icon-box"><EnvironmentOutlined /></div>
                          <div className="info-text-group">
                            <Text className="info-label">Địa chỉ</Text>
                            <Text strong>{bookingQuery.data.diaChiLienHe || 'Chưa cập nhật'}</Text>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>

                  <Card className="booking-info-card" variant="borderless" title={<span><IdcardOutlined /> Danh sách hành khách ({bookingQuery.data.tongHanhKhach})</span>}>
                    <div className="passenger-grid">
                      {bookingQuery.data.hanhKhachs.map((item, index) => (
                        <div key={item.id} className="passenger-item">
                          <div className="passenger-num">{index + 1}</div>
                          <div className="passenger-info">
                            <Text strong className="passenger-name">{item.hoTen}</Text>
                            <div className="passenger-meta">
                              <Tag className="passenger-tag">{formatTrangThai(item.loaiKhach)}</Tag>
                              <Text className="passenger-sub">{item.gioiTinh} • {item.quocTich || 'Việt Nam'}</Text>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </Col>

              {/* 3. Payment & Pricing Sidebar */}
              <Col xs={24} lg={8}>
                <div className="booking-sidebar-stack">
                  <Card className="booking-summary-card" variant="borderless" title={<span><CreditCardOutlined /> Tóm tắt thanh toán</span>}>
                    <div className="summary-rows">
                      <div className="summary-row">
                        <Text>Người lớn x {bookingQuery.data.soNguoiLon}</Text>
                        <Text strong>{formatMoney(bookingQuery.data.donGiaNguoiLon * bookingQuery.data.soNguoiLon)}</Text>
                      </div>
                      {bookingQuery.data.soTreEm > 0 && (
                        <div className="summary-row">
                          <Text>Trẻ em x {bookingQuery.data.soTreEm}</Text>
                          <Text strong>{formatMoney(bookingQuery.data.donGiaTreEm * bookingQuery.data.soTreEm)}</Text>
                        </div>
                      )}
                      {bookingQuery.data.soEmBe > 0 && (
                        <div className="summary-row">
                          <Text>Em bé x {bookingQuery.data.soEmBe}</Text>
                          <Text strong>{formatMoney(bookingQuery.data.donGiaEmBe * bookingQuery.data.soEmBe)}</Text>
                        </div>
                      )}
                      
                      <Divider className="summary-divider" />
                      
                      <div className="summary-row">
                        <Text>Tạm tính</Text>
                        <Text strong>{formatMoney(bookingQuery.data.tamTinh)}</Text>
                      </div>
                      <div className="summary-row discount">
                        <Text>Giảm giá {bookingQuery.data.maVoucher ? `(${bookingQuery.data.maVoucher})` : ''}</Text>
                        <Text strong>- {formatMoney(bookingQuery.data.giamGia)}</Text>
                      </div>

                      <div className="summary-total-box">
                        <Text className="total-label">Tổng cộng</Text>
                        <Title level={3} className="total-value">{formatMoney(bookingQuery.data.tongTien)}</Title>
                      </div>

                      <div className="payment-progress">
                        <div className="progress-label">
                          <Text>Đã thanh toán</Text>
                          <Text strong>{formatMoney(bookingQuery.data.soTienDaThanhToan)}</Text>
                        </div>
                        <div className="progress-bar-bg">
                          <div 
                            className="progress-bar-fill" 
                            style={{ width: `${Math.min(100, (bookingQuery.data.soTienDaThanhToan / bookingQuery.data.tongTien) * 100)}%` }}
                          ></div>
                        </div>
                        {bookingQuery.data.tongTien > bookingQuery.data.soTienDaThanhToan && (
                          <Text className="remaining-label">Còn lại: {formatMoney(bookingQuery.data.tongTien - bookingQuery.data.soTienDaThanhToan)}</Text>
                        )}
                      </div>
                    </div>
                  </Card>

                  <Card className="booking-history-card" variant="borderless" title={<span><ClockCircleOutlined /> Lịch sử thanh toán</span>}>
                    {paymentQuery.isLoading ? <Skeleton active paragraph={{ rows: 3 }} /> : (
                      <div className="payment-history-list">
                        {(paymentQuery.data ?? []).length === 0 ? (
                          <Empty description="Chưa có giao dịch" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        ) : (
                          paymentQuery.data?.map((payment) => (
                            <div key={payment.id} className="payment-history-item">
                              <div className="history-icon">
                                {payment.trangThai === 'da_thanh_toan' ? <CheckCircleOutlined style={{ color: '#10b981' }} /> : <SyncOutlined spin style={{ color: '#3b82f6' }} />}
                              </div>
                              <div className="history-info">
                                <Text strong>{formatMoney(payment.soTien)}</Text>
                                <Text className="history-sub">{formatTrangThai(payment.phuongThucThanhToan)} • {formatDate(payment.thoiGianTao)}</Text>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </Card>

                  {bookingQuery.data.coTheDanhGia && (
                    <Button type="primary" block className="review-action-btn" size="large">
                      <Link to={`${PATHS.myReviews}?bookingId=${bookingQuery.data.id}`}>Viết đánh giá cho chuyến đi</Link>
                    </Button>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        ) : null}
      </div>
    </div>
  )
}
