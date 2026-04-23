import { Alert, Card, Col, Empty, Progress, Row, Skeleton, Space, Statistic, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo } from 'react'
import { useAdminDashboardSummary, useUpdateAdminReviewStatus } from '../../services/admin/admin.hooks'
import type { AdminPendingPayment, AdminPendingReview, AdminRecentBooking, AdminTopTour } from '../../types/admin'
import { formatMoney } from '../../utils/formatMoney'
import './AdminDashboardPage.css'

const { Paragraph, Title, Text } = Typography

function MiniLineChart({ values }: { values: number[] }) {
  if (values.length === 0) {
    return <div className="admin-dashboard-chart-empty">Chưa có dữ liệu</div>
  }

  const max = Math.max(...values, 1)
  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * 100
    const y = 100 - (value / max) * 80
    return `${x},${y}`
  }).join(' ')

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="admin-dashboard-line-chart">
      <polyline points={points} fill="none" stroke="#20c7b7" strokeWidth="2.5" />
      {values.map((value, index) => {
        const x = (index / Math.max(values.length - 1, 1)) * 100
        const y = 100 - (value / max) * 80
        return <circle key={`${index}-${value}`} cx={x} cy={y} r="2.8" fill="#20c7b7" />
      })}
    </svg>
  )
}

function MiniBarChart({ values }: { values: number[] }) {
  if (values.length === 0) {
    return <div className="admin-dashboard-chart-empty">Chưa có dữ liệu</div>
  }

  const max = Math.max(...values, 1)

  return (
    <div className="admin-dashboard-bar-chart">
      {values.map((value, index) => (
        <div key={`${index}-${value}`} className="admin-dashboard-bar-group">
          <div className="admin-dashboard-bar" style={{ height: `${(value / max) * 220}px` }} />
        </div>
      ))}
    </div>
  )
}

const recentBookingColumns: ColumnsType<AdminRecentBooking> = [
  {
    title: 'Booking',
    dataIndex: 'maBooking',
    key: 'maBooking',
    render: (value: string, record) => (
      <Space size={0} className="admin-dashboard-stack-vertical">
        <Text strong>{value}</Text>
        <Text type="secondary">{record.hoTenNguoiDat}</Text>
      </Space>
    ),
  },
  {
    title: 'Tour',
    dataIndex: 'tenTour',
    key: 'tenTour',
  },
  {
    title: 'Thanh toán',
    dataIndex: 'trangThaiThanhToan',
    key: 'trangThaiThanhToan',
    render: (value: string) => <Tag color={value === 'da_thanh_toan_du' ? 'green' : 'orange'}>{value}</Tag>,
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'tongTien',
    key: 'tongTien',
    render: (value: number) => formatMoney(value),
  },
]

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useAdminDashboardSummary()
  const updateReviewStatusMutation = useUpdateAdminReviewStatus()

  const revenueValues = useMemo(() => (data?.doanhThuTheoThang ?? []).map((item) => item.giaTri), [data])
  const bookingValues = useMemo(() => (data?.bookingTheoThang ?? []).map((item) => item.giaTri), [data])

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 18 }} />
  }

  if (isError || !data) {
    return <Alert type="error" showIcon message={error instanceof Error ? error.message : 'Không thể tải dashboard quản trị'} />
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-heading">
        <Title level={1}>Tổng quan</Title>
        <Paragraph>Xin chào! Đây là bảng điều khiển quản lý tour du lịch của bạn.</Paragraph>
      </div>

      <Row gutter={[18, 18]}>
        <Col xs={24} md={12} xl={6}><Card className="admin-kpi-card"><Statistic title="Tổng tour" value={data.tongTour} /><span className="admin-kpi-meta">↑ dữ liệu thật từ hệ thống</span></Card></Col>
        <Col xs={24} md={12} xl={6}><Card className="admin-kpi-card"><Statistic title="Tour đang mở bán" value={data.tourDangMoBan} /><span className="admin-kpi-meta">↑ trạng thái mở bán</span></Card></Col>
        <Col xs={24} md={12} xl={6}><Card className="admin-kpi-card"><Statistic title="Tổng booking" value={data.tongBooking} /><span className="admin-kpi-meta">↑ số booking hiện có</span></Card></Col>
        <Col xs={24} md={12} xl={6}><Card className="admin-kpi-card"><Statistic title="Doanh thu" value={data.tongDoanhThu} formatter={(value) => formatMoney(Number(value))} /><span className="admin-kpi-meta">↑ tổng doanh thu booking</span></Card></Col>
        <Col xs={24} md={12} xl={6}><Card className="admin-kpi-card"><Statistic title="Tổng khách" value={data.tongKhachHang} /><span className="admin-kpi-meta">↑ khách hàng hoạt động</span></Card></Col>
        <Col xs={24} md={12} xl={6}><Card className="admin-kpi-card"><Statistic title="Tỷ lệ thanh toán đủ" value={data.tyLeThanhToanDu} suffix="%" /><span className="admin-kpi-meta">↑ theo booking đã thanh toán đủ</span></Card></Col>
        <Col xs={24} md={12} xl={6}><Card className="admin-kpi-card"><Statistic title="Booking chờ xử lý" value={data.bookingChoXuLy} /><span className="admin-kpi-meta">↑ cần theo dõi</span></Card></Col>
        <Col xs={24} md={12} xl={6}><Card className="admin-kpi-card"><Statistic title="Đánh giá trung bình" value={data.diemDanhGiaTrungBinh} precision={1} /><span className="admin-kpi-meta">↑ tính từ review thật</span></Card></Col>
      </Row>

      <Row gutter={[18, 18]}>
        <Col xs={24} xl={12}>
          <Card title="Doanh thu theo tháng" className="admin-dashboard-chart-card">
            <MiniLineChart values={revenueValues} />
            <div className="admin-dashboard-chart-labels">
              {data.doanhThuTheoThang.map((item) => <span key={item.nhan}>{item.nhan}</span>)}
            </div>
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card title="Booking theo tháng" className="admin-dashboard-chart-card">
            <MiniBarChart values={bookingValues} />
            <div className="admin-dashboard-chart-labels">
              {data.bookingTheoThang.map((item) => <span key={item.nhan}>{item.nhan}</span>)}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[18, 18]}>
        <Col xs={24} xl={12}>
          <Card title="Top tour bán chạy" className="admin-dashboard-list-card">
            {data.topTours.length === 0 ? <Empty description="Chưa có dữ liệu" /> : data.topTours.map((tour: AdminTopTour) => (
              <div key={tour.tourId} className="admin-dashboard-list-item">
                <div>
                  <Text strong>{tour.tenTour}</Text>
                  <div className="admin-dashboard-subtext">{tour.soBooking} booking</div>
                </div>
                <Text className="admin-dashboard-amount">{formatMoney(tour.doanhThu)}</Text>
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card title="Tình trạng thanh toán" className="admin-dashboard-list-card">
            {data.tinhTrangThanhToan.length === 0 ? <Empty description="Chưa có dữ liệu" /> : data.tinhTrangThanhToan.map((item) => (
              <div key={item.trangThai} className="admin-dashboard-payment-row">
                <div className="admin-dashboard-payment-head">
                  <Text>{item.trangThai}</Text>
                  <Text>{item.tyLe}%</Text>
                </div>
                <Progress percent={Number(item.tyLe)} showInfo={false} strokeColor="#20c7b7" trailColor="#eef2f7" />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Row gutter={[18, 18]}>
        <Col xs={24} xl={12}>
          <Card title="Booking mới" className="admin-dashboard-list-card">
            {data.bookingMoi.length === 0 ? <Empty description="Chưa có booking" /> : data.bookingMoi.map((booking: AdminRecentBooking) => (
              <div key={booking.id} className="admin-dashboard-booking-card">
                <div>
                  <Space size={10} wrap>
                    <Text strong>{booking.maBooking}</Text>
                    <Tag color={booking.trangThaiBooking === 'da_xac_nhan' ? 'green' : 'orange'}>{booking.trangThaiBooking}</Tag>
                  </Space>
                  <div className="admin-dashboard-subtext">{booking.hoTenNguoiDat} - {booking.tenTour}</div>
                </div>
                <Text className="admin-dashboard-amount">{formatMoney(booking.tongTien)}</Text>
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card title="Thanh toán chờ xác nhận" className="admin-dashboard-list-card">
            {data.thanhToanChoXacNhan.length === 0 ? <Empty description="Không có thanh toán chờ xác nhận" /> : data.thanhToanChoXacNhan.map((payment: AdminPendingPayment) => (
              <div key={payment.id} className="admin-dashboard-booking-card">
                <div>
                  <Space size={10} wrap>
                    <Text strong>{payment.maGiaoDich}</Text>
                    <Tag>{payment.phuongThucThanhToan}</Tag>
                  </Space>
                  <div className="admin-dashboard-subtext">{payment.hoTenKhachHang} - {payment.maBooking}</div>
                </div>
                <Text className="admin-dashboard-amount warning">{formatMoney(payment.soTien)}</Text>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Card title="Đánh giá chờ duyệt" className="admin-dashboard-list-card">
        {data.danhGiaChoDuyet.length === 0 ? <Empty description="Không có đánh giá chờ duyệt" /> : data.danhGiaChoDuyet.map((review: AdminPendingReview) => (
          <div key={review.id} className="admin-dashboard-review-card">
            <div>
              <Space size={10} wrap>
                <Text strong>{review.hoTenKhachHang}</Text>
                <Text className="admin-dashboard-stars">{'★'.repeat(review.soSao)}</Text>
              </Space>
              <div className="admin-dashboard-subtext">{review.tenTour}</div>
              <div className="admin-dashboard-review-text">{review.noiDung}</div>
            </div>
            <Space>
              <button type="button" className="admin-dashboard-action approve" onClick={() => void updateReviewStatusMutation.mutateAsync({ id: review.id, trangThai: 'hien_thi' })}>
                Duyệt
              </button>
              <button type="button" className="admin-dashboard-action reject" onClick={() => void updateReviewStatusMutation.mutateAsync({ id: review.id, trangThai: 'an' })}>
                Ẩn
              </button>
            </Space>
          </div>
        ))}
      </Card>

      <Card title="Bảng booking gần nhất" className="admin-dashboard-table-card">
        <Table rowKey="id" columns={recentBookingColumns} dataSource={data.bookingMoi} pagination={false} locale={{ emptyText: <Empty description="Chưa có dữ liệu" /> }} />
      </Card>
    </div>
  )
}
