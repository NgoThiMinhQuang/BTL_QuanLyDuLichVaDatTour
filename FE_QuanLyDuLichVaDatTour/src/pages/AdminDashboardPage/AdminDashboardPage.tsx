import { Alert, Button, Card, Col, Empty, Progress, Row, Skeleton, Space, Statistic, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Link } from 'react-router'
import { useMemo } from 'react'
import { PATHS } from '../../constants/paths'
import { useAdminDashboardSummary, useUpdateAdminReviewDisplayStatus } from '../../services/admin/admin.hooks'
import type { AdminPendingPayment, AdminPendingReview, AdminRecentBooking, AdminTopTour } from '../../types/admin'
import { formatMoney } from '../../utils/formatMoney'
import { adminBookingStatusMeta, adminPaymentStatusMeta } from '../../utils/admin'
import {
  AppstoreOutlined,
  CompassOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UsergroupAddOutlined,
  PieChartOutlined,
  ClockCircleOutlined,
  StarOutlined
} from '@ant-design/icons'
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
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,100 ${points} 100,100`} fill="url(#lineGrad)" />
      <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((value, index) => {
        const x = (index / Math.max(values.length - 1, 1)) * 100
        const y = 100 - (value / max) * 80
        return <circle key={`${index}-${value}`} cx={x} cy={y} r="3" fill="#ffffff" stroke="#3b82f6" strokeWidth="2" />
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
          <div className="admin-dashboard-bar" style={{ height: `${Math.max((value / max) * 100, 5)}%` }} />
        </div>
      ))}
    </div>
  )
}

const quickAccessItems = [
  { title: 'Quản lý tour', description: 'Danh mục tour, trạng thái', to: PATHS.adminTours },
  { title: 'Booking', description: 'Theo dõi đơn đặt tour', to: PATHS.adminBookings },
  { title: 'Thanh toán', description: 'Xử lý giao dịch', to: PATHS.adminPayments },
  { title: 'Voucher', description: 'Tạo ưu đãi chiến dịch', to: PATHS.adminVouchers },
  { title: 'Tin tức', description: 'Quản trị bài viết', to: PATHS.adminTinTucs },
  { title: 'Lịch khởi hành', description: 'Đợt tour & chỗ bán', to: PATHS.adminLichKhoiHanhs },
]

const recentBookingColumns: ColumnsType<AdminRecentBooking> = [
  {
    title: 'Booking',
    dataIndex: 'maBooking',
    key: 'maBooking',
    render: (value: string, record) => (
      <Space size={0} className="admin-dashboard-stack-vertical">
        <Text strong className="font-sm">{value}</Text>
        <Text type="secondary" className="font-xs">{record.hoTenNguoiDat}</Text>
      </Space>
    ),
  },
  {
    title: 'Tour',
    dataIndex: 'tenTour',
    key: 'tenTour',
    render: (text) => <Text className="font-sm line-clamp-1">{text}</Text>
  },
  {
    title: 'Booking',
    dataIndex: 'trangThaiBooking',
    key: 'trangThaiBooking',
    render: (value: keyof typeof adminBookingStatusMeta | string) => {
      const meta = adminBookingStatusMeta[value as keyof typeof adminBookingStatusMeta]
      return <Tag color={meta?.color ?? 'default'} className="status-tag-sm">{meta?.label ?? value}</Tag>
    },
  },
  {
    title: 'Thanh toán',
    dataIndex: 'trangThaiThanhToan',
    key: 'trangThaiThanhToan',
    render: (value: keyof typeof adminPaymentStatusMeta | string) => {
      const meta = adminPaymentStatusMeta[value as keyof typeof adminPaymentStatusMeta]
      return <Tag color={meta?.color ?? 'default'} className="status-tag-sm">{meta?.label ?? value}</Tag>
    },
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'tongTien',
    key: 'tongTien',
    render: (value: number) => <Text strong className="font-sm text-primary">{formatMoney(value)}</Text>,
  },
]

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useAdminDashboardSummary()
  const updateReviewStatusMutation = useUpdateAdminReviewDisplayStatus()

  const revenueValues = useMemo(() => (data?.doanhThuTheoThang ?? []).map((item) => item.giaTri), [data])
  const bookingValues = useMemo(() => (data?.bookingTheoThang ?? []).map((item) => item.giaTri), [data])

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 18 }} />
  }

  if (isError || !data) {
    return <Alert type="error" showIcon title={error instanceof Error ? error.message : 'Không thể tải dashboard quản trị'} />
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-heading">
        <Title level={2}>Bảng điều khiển quản trị</Title>
        <Paragraph>Tổng quan hoạt động kinh doanh, booking và doanh thu hệ thống.</Paragraph>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <div className="admin-kpi-card">
            <div className="kpi-icon-box bg-blue"><AppstoreOutlined /></div>
            <div className="kpi-info">
              <Text className="kpi-title">Tổng tour</Text>
              <Title level={3} className="kpi-value">{data.tongTour}</Title>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <div className="admin-kpi-card">
            <div className="kpi-icon-box bg-green"><CompassOutlined /></div>
            <div className="kpi-info">
              <Text className="kpi-title">Tour đang mở bán</Text>
              <Title level={3} className="kpi-value">{data.tourDangMoBan}</Title>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <div className="admin-kpi-card">
            <div className="kpi-icon-box bg-purple"><ShoppingCartOutlined /></div>
            <div className="kpi-info">
              <Text className="kpi-title">Tổng booking</Text>
              <Title level={3} className="kpi-value">{data.tongBooking}</Title>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <div className="admin-kpi-card">
            <div className="kpi-icon-box bg-orange"><DollarOutlined /></div>
            <div className="kpi-info">
              <Text className="kpi-title">Doanh thu</Text>
              <Title level={3} className="kpi-value">{formatMoney(Number(data.tongDoanhThu))}</Title>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <div className="admin-kpi-card">
            <div className="kpi-icon-box bg-cyan"><UsergroupAddOutlined /></div>
            <div className="kpi-info">
              <Text className="kpi-title">Tổng khách hàng</Text>
              <Title level={3} className="kpi-value">{data.tongKhachHang}</Title>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <div className="admin-kpi-card">
            <div className="kpi-icon-box bg-indigo"><PieChartOutlined /></div>
            <div className="kpi-info">
              <Text className="kpi-title">Tỷ lệ thanh toán đủ</Text>
              <Title level={3} className="kpi-value">{data.tyLeThanhToanDu}%</Title>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <div className="admin-kpi-card">
            <div className="kpi-icon-box bg-red"><ClockCircleOutlined /></div>
            <div className="kpi-info">
              <Text className="kpi-title">Booking chờ xử lý</Text>
              <Title level={3} className="kpi-value">{data.bookingChoXuLy}</Title>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <div className="admin-kpi-card">
            <div className="kpi-icon-box bg-yellow"><StarOutlined /></div>
            <div className="kpi-info">
              <Text className="kpi-title">Đánh giá trung bình</Text>
              <Title level={3} className="kpi-value">{Number(data.diemDanhGiaTrungBinh).toFixed(1)}</Title>
            </div>
          </div>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card title="Doanh thu theo tháng" bordered={false} className="admin-dashboard-card">
            <MiniLineChart values={revenueValues} />
            <div className="admin-dashboard-chart-labels">
              {data.doanhThuTheoThang.map((item) => <span key={item.nhan}>{item.nhan}</span>)}
            </div>
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card title="Booking theo tháng" bordered={false} className="admin-dashboard-card">
            <MiniBarChart values={bookingValues} />
            <div className="admin-dashboard-chart-labels">
              {data.bookingTheoThang.map((item) => <span key={item.nhan}>{item.nhan}</span>)}
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Truy cập nhanh" bordered={false} className="admin-dashboard-card">
        <div className="admin-dashboard-quick-grid">
          {quickAccessItems.map((item) => (
            <Link key={item.to} to={item.to} className="admin-dashboard-quick-link">
              <Text strong className="quick-title">{item.title}</Text>
              <Text className="quick-desc">{item.description}</Text>
            </Link>
          ))}
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Top tour bán chạy" bordered={false} className="admin-dashboard-card list-card">
            {data.topTours.length === 0 ? <Empty description="Chưa có dữ liệu" /> : data.topTours.map((tour: AdminTopTour) => (
              <div key={tour.tourId} className="admin-list-item">
                <div className="list-item-main">
                  <Text strong className="list-item-title">{tour.tenTour}</Text>
                  <Text className="list-item-sub">{tour.maTour} • {tour.soBooking} booking</Text>
                </div>
                <Text className="list-item-amount text-blue">{formatMoney(tour.doanhThu)}</Text>
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Tình trạng thanh toán tổng thể" bordered={false} className="admin-dashboard-card list-card">
            {data.tinhTrangThanhToan.length === 0 ? <Empty description="Chưa có dữ liệu" /> : data.tinhTrangThanhToan.map((item) => (
              <div key={item.trangThai} className="admin-progress-row">
                <div className="progress-head">
                  <Text strong className="font-sm">{item.trangThai}</Text>
                  <Text strong className="font-sm">{item.tyLe}%</Text>
                </div>
                <Progress percent={Number(item.tyLe)} showInfo={false} strokeColor="#3b82f6" trailColor="#f1f5f9" size="small" />
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Booking mới nhất" bordered={false} className="admin-dashboard-card list-card" extra={<Link to={PATHS.adminBookings} className="view-all-link">Xem tất cả</Link>}>
            {data.bookingMoi.length === 0 ? <Empty description="Chưa có booking" /> : data.bookingMoi.slice(0, 5).map((booking: AdminRecentBooking) => (
              <div key={booking.id} className="admin-list-item">
                <div className="list-item-main">
                  <Space size={8} wrap>
                    <Text strong>{booking.maBooking}</Text>
                    <Tag className="status-tag-sm" color={adminBookingStatusMeta[booking.trangThaiBooking as keyof typeof adminBookingStatusMeta]?.color ?? 'default'}>
                      {adminBookingStatusMeta[booking.trangThaiBooking as keyof typeof adminBookingStatusMeta]?.label ?? booking.trangThaiBooking}
                    </Tag>
                  </Space>
                  <Text className="list-item-sub">{booking.hoTenNguoiDat} • {booking.tenTour}</Text>
                </div>
                <Text className="list-item-amount text-primary">{formatMoney(booking.tongTien)}</Text>
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Thanh toán chờ xác nhận" bordered={false} className="admin-dashboard-card list-card" extra={<Link to={PATHS.adminPayments} className="view-all-link">Xem tất cả</Link>}>
            {data.thanhToanChoXacNhan.length === 0 ? <Empty description="Không có thanh toán chờ" /> : data.thanhToanChoXacNhan.slice(0, 5).map((payment: AdminPendingPayment) => (
              <div key={payment.id} className="admin-list-item">
                <div className="list-item-main">
                  <Space size={8} wrap>
                    <Text strong>{payment.maGiaoDich}</Text>
                    <Tag className="status-tag-sm">{payment.phuongThucThanhToan}</Tag>
                  </Space>
                  <Text className="list-item-sub">{payment.hoTenKhachHang} • {payment.maBooking}</Text>
                </div>
                <Text className="list-item-amount text-orange">{formatMoney(payment.soTien)}</Text>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Đánh giá chờ duyệt" bordered={false} className="admin-dashboard-card list-card" extra={<Link to={PATHS.adminReviews} className="view-all-link">Quản lý</Link>}>
            {data.danhGiaChoDuyet.length === 0 ? <Empty description="Không có đánh giá chờ duyệt" /> : data.danhGiaChoDuyet.map((review: AdminPendingReview) => (
              <div key={review.id} className="admin-list-item review-item">
                <div className="list-item-main">
                  <Space size={8}>
                    <Text strong>{review.hoTenKhachHang}</Text>
                    <Text className="star-rating">{'★'.repeat(review.soSao)}</Text>
                  </Space>
                  <Text className="list-item-sub">{review.tenTour}</Text>
                  <Paragraph ellipsis={{ rows: 2 }} className="review-text">{review.noiDung}</Paragraph>
                </div>
                <Space direction="vertical" size="small">
                  <Button size="small" type="primary" onClick={() => void updateReviewStatusMutation.mutateAsync({ id: review.id, trangThai: 'hien_thi' })}>Duyệt</Button>
                  <Button size="small" danger onClick={() => void updateReviewStatusMutation.mutateAsync({ id: review.id, trangThai: 'an' })}>Ẩn</Button>
                </Space>
              </div>
            ))}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Bảng booking chi tiết" bordered={false} className="admin-dashboard-card table-card">
            <Table 
              rowKey="id" 
              columns={recentBookingColumns} 
              dataSource={data.bookingMoi} 
              pagination={false} 
              size="small"
              scroll={{ x: 600 }}
              locale={{ emptyText: <Empty description="Chưa có dữ liệu" /> }} 
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
