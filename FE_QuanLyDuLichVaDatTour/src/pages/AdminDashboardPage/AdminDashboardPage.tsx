import { Alert, Card, Col, Empty, Row, Space, Statistic, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo } from 'react'
import { useAdminBookings, useAdminTours } from '../../services/admin/admin.hooks'
import type { AdminBookingItem, AdminPaymentStatus, AdminTourItem } from '../../types/admin'
import { formatDate } from '../../utils/formatDate'
import { formatMoney } from '../../utils/formatMoney'
import './AdminDashboardPage.css'

const { Paragraph, Title, Text } = Typography

const paymentStatusMeta: Record<AdminPaymentStatus, { label: string; color: string }> = {
  chua_thanh_toan: { label: 'Chưa thanh toán', color: 'default' },
  thanh_toan_mot_phan: { label: 'Thanh toán một phần', color: 'processing' },
  da_thanh_toan_du: { label: 'Đã thanh toán đủ', color: 'success' },
  that_bai: { label: 'Thất bại', color: 'error' },
  da_hoan_tien: { label: 'Đã hoàn tiền', color: 'warning' },
}

function getTopTours(bookings: AdminBookingItem[]) {
  const grouped = new Map<number, { tourId: number; tenTour: string; soBooking: number; doanhThu: number }>()

  for (const booking of bookings) {
    const existing = grouped.get(booking.tourId)

    if (existing) {
      existing.soBooking += 1
      existing.doanhThu += booking.tongTien
      continue
    }

    grouped.set(booking.tourId, {
      tourId: booking.tourId,
      tenTour: booking.tenTour,
      soBooking: 1,
      doanhThu: booking.tongTien,
    })
  }

  return Array.from(grouped.values())
    .sort((left, right) => right.soBooking - left.soBooking || right.doanhThu - left.doanhThu)
    .slice(0, 5)
}

export default function AdminDashboardPage() {
  const toursQuery = useAdminTours()
  const bookingsQuery = useAdminBookings()

  const tours = toursQuery.data ?? []
  const bookings = bookingsQuery.data ?? []
  const isLoading = toursQuery.isLoading || bookingsQuery.isLoading
  const isError = toursQuery.isError || bookingsQuery.isError
  const errorMessage = toursQuery.error instanceof Error
    ? toursQuery.error.message
    : bookingsQuery.error instanceof Error
      ? bookingsQuery.error.message
      : 'Không thể tải dashboard quản trị'

  const summary = useMemo(() => {
    const tongTourDangMoBan = tours.filter((tour) => tour.trangThai === 'dang_mo_ban').length
    const tongBookingChoXuLy = bookings.filter((booking) => booking.trangThaiBooking === 'moi_tao' || booking.trangThaiBooking === 'cho_thanh_toan').length
    const tongBookingChuaThanhToan = bookings.filter((booking) => booking.trangThaiThanhToan !== 'da_thanh_toan_du').length
    const tongDoanhThu = bookings.reduce((total, booking) => total + booking.tongTien, 0)

    return {
      tongTour: tours.length,
      tongTourDangMoBan,
      tongBooking: bookings.length,
      tongBookingChoXuLy,
      tongBookingChuaThanhToan,
      tongDoanhThu,
    }
  }, [bookings, tours])

  const topTours = useMemo(() => getTopTours(bookings), [bookings])
  const recentBookings = useMemo(() => {
    return [...bookings]
      .sort((left, right) => new Date(right.ngayDat).getTime() - new Date(left.ngayDat).getTime())
      .slice(0, 5)
  }, [bookings])

  const topTourColumns: ColumnsType<{ tourId: number; tenTour: string; soBooking: number; doanhThu: number }> = [
    {
      title: 'Tour',
      dataIndex: 'tenTour',
      key: 'tenTour',
      render: (value: string, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{value}</Text>
          <Text type="secondary">Mã nội bộ: #{record.tourId}</Text>
        </Space>
      ),
    },
    {
      title: 'Số booking',
      dataIndex: 'soBooking',
      key: 'soBooking',
      width: 120,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'doanhThu',
      key: 'doanhThu',
      width: 150,
      render: (value: number) => formatMoney(value),
    },
  ]

  const recentBookingColumns: ColumnsType<AdminBookingItem> = [
    {
      title: 'Booking',
      dataIndex: 'maBooking',
      key: 'maBooking',
      render: (value: string, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{value}</Text>
          <Text type="secondary">{record.hoTenNguoiDat || record.hoTenLienHe}</Text>
        </Space>
      ),
    },
    {
      title: 'Tour',
      dataIndex: 'tenTour',
      key: 'tenTour',
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'ngayDat',
      key: 'ngayDat',
      width: 130,
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'trangThaiThanhToan',
      key: 'trangThaiThanhToan',
      width: 180,
      render: (value: AdminPaymentStatus) => <Tag color={paymentStatusMeta[value].color}>{paymentStatusMeta[value].label}</Tag>,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'tongTien',
      key: 'tongTien',
      width: 140,
      render: (value: number) => formatMoney(value),
    },
  ]

  return (
    <div className="admin-dashboard-page">
      <div className="admin-page-heading">
        <Title level={3}>Dashboard quản trị</Title>
        <Paragraph className="admin-page-description">
          Theo dõi nhanh số lượng tour, booking và các chỉ số vận hành được tổng hợp từ dữ liệu thật trong hệ thống.
        </Paragraph>
      </div>

      {isError ? <Alert type="error" showIcon message={errorMessage} /> : null}

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <Card loading={isLoading}>
            <Statistic title="Tổng tour" value={summary.tongTour} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card loading={isLoading}>
            <Statistic title="Tour đang mở bán" value={summary.tongTourDangMoBan} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card loading={isLoading}>
            <Statistic title="Tổng booking" value={summary.tongBooking} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card loading={isLoading}>
            <Statistic title="Booking chờ xử lý" value={summary.tongBookingChoXuLy} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={12}>
          <Card loading={isLoading}>
            <Statistic title="Doanh thu từ booking" value={summary.tongDoanhThu} formatter={(value) => formatMoney(Number(value))} />
          </Card>
        </Col>
        <Col xs={24} md={12} xl={12}>
          <Card loading={isLoading}>
            <Statistic title="Booking chưa thanh toán đủ" value={summary.tongBookingChuaThanhToan} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <Card title="Top tour theo số booking" loading={isLoading}>
            {topTours.length === 0 && !isLoading ? <Empty description="Chưa có booking để thống kê" /> : null}
            {topTours.length > 0 ? (
              <Table rowKey="tourId" columns={topTourColumns} dataSource={topTours} pagination={false} />
            ) : null}
          </Card>
        </Col>
        <Col xs={24} xl={12}>
          <Card title="Booking mới nhất" loading={isLoading}>
            {recentBookings.length === 0 && !isLoading ? <Empty description="Chưa có booking nào" /> : null}
            {recentBookings.length > 0 ? (
              <Table rowKey="id" columns={recentBookingColumns} dataSource={recentBookings} pagination={false} />
            ) : null}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
