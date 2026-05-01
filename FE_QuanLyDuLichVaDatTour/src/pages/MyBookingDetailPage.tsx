import './MyBookingDetailPage.css'
import { Alert, Card, Descriptions, Empty, List, Skeleton, Space, Tag, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
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
          <Space orientation="vertical" size={18} className="customer-page-stack">
            <Card className="customer-booking-card" variant="borderless">
              <Space orientation="vertical" size={14} className="customer-booking-card-stack">
                <div className="customer-booking-card-header">
                  <div>
                    <Title level={3} className="customer-booking-card-title">{bookingQuery.data.tenTour}</Title>
                    <Paragraph className="customer-booking-card-code">Mã booking: {bookingQuery.data.maBooking}</Paragraph>
                  </div>
                  <Space wrap>
                    <Tag color="blue">Booking: {formatTrangThai(bookingQuery.data.trangThaiBooking)}</Tag>
                    <Tag color="gold">Thanh toán: {formatTrangThai(bookingQuery.data.trangThaiThanhToan)}</Tag>
                  </Space>
                </div>

                <Descriptions bordered column={2} size="middle">
                  <Descriptions.Item label="Ngày đặt">{formatDate(bookingQuery.data.ngayDat)}</Descriptions.Item>
                  <Descriptions.Item label="Đợt tour">{bookingQuery.data.maDotTour}</Descriptions.Item>
                  <Descriptions.Item label="Khởi hành">{formatDate(bookingQuery.data.ngayKhoiHanh)}</Descriptions.Item>
                  <Descriptions.Item label="Kết thúc">{formatDate(bookingQuery.data.ngayKetThuc)}</Descriptions.Item>
                  <Descriptions.Item label="Liên hệ">{bookingQuery.data.hoTenLienHe}</Descriptions.Item>
                  <Descriptions.Item label="Email">{bookingQuery.data.emailLienHe}</Descriptions.Item>
                  <Descriptions.Item label="Điện thoại">{bookingQuery.data.soDienThoaiLienHe}</Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">{bookingQuery.data.diaChiLienHe || 'Chưa cập nhật'}</Descriptions.Item>
                  <Descriptions.Item label="Tổng hành khách">{bookingQuery.data.tongHanhKhach}</Descriptions.Item>
                  <Descriptions.Item label="Tổng tiền">{formatMoney(bookingQuery.data.tongTien)}</Descriptions.Item>
                  <Descriptions.Item label="Đã thanh toán">{formatMoney(bookingQuery.data.soTienDaThanhToan)}</Descriptions.Item>
                  <Descriptions.Item label="Voucher">{bookingQuery.data.maVoucher || 'Không áp dụng'}</Descriptions.Item>
                </Descriptions>

                {bookingQuery.data.coTheDanhGia ? (
                  <div>
                    <Link to={`${PATHS.myReviews}?bookingId=${bookingQuery.data.id}`}>Đi tới trang đánh giá tour</Link>
                  </div>
                ) : null}
              </Space>
            </Card>

            <Card className="customer-booking-card" title="Danh sách hành khách" variant="borderless">
              <List
                dataSource={bookingQuery.data.hanhKhachs}
                locale={{ emptyText: 'Chưa có hành khách' }}
                renderItem={(item) => (
                  <List.Item>
                    <Space orientation="vertical" size={2}>
                      <Text strong>{item.hoTen}</Text>
                      <Text>Loại khách: {formatTrangThai(item.loaiKhach)}</Text>
                      <Text>Giới tính: {item.gioiTinh || 'Chưa cập nhật'} | Quốc tịch: {item.quocTich || 'Chưa cập nhật'}</Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>

            <Card className="customer-booking-card" title="Lịch sử thanh toán" variant="borderless">
              {paymentQuery.isLoading ? <Skeleton active paragraph={{ rows: 4 }} /> : null}
              {paymentQuery.isError ? <Alert type="warning" showIcon title={paymentQuery.error instanceof Error ? paymentQuery.error.message : 'Không thể tải lịch sử thanh toán'} /> : null}
              {!paymentQuery.isLoading && !paymentQuery.isError ? (
                <List
                  dataSource={paymentQuery.data ?? []}
                  locale={{ emptyText: 'Chưa có giao dịch thanh toán' }}
                  renderItem={(payment) => (
                    <List.Item>
                      <Space orientation="vertical" size={2}>
                        <Text strong>{formatMoney(payment.soTien)}</Text>
                        <Text>Phương thức: {formatTrangThai(payment.phuongThucThanhToan)}</Text>
                        <Text>Trạng thái: {formatTrangThai(payment.trangThai)}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              ) : null}
            </Card>
          </Space>
        ) : null}
      </div>
    </div>
  )
}
