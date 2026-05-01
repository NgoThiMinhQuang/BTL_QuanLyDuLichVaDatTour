import { Alert, Button, Descriptions, Drawer, Empty, Form, Input, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useMemo, useState } from 'react'
import { useAdminBooking, useAdminBookings, useUpdateAdminBookingStatus } from '../../services/admin/admin.hooks'
import type { AdminBookingItem, AdminBookingStatus, AdminPaymentStatus } from '../../types/admin'
import { formatDate } from '../../utils/formatDate'
import { formatMoney } from '../../utils/formatMoney'
import { adminBookingStatusMeta, adminPaymentStatusMeta, formatDateTime, mapStatusOptions } from '../../utils/admin'
import './AdminBookingListPage.css'

const { Paragraph, Text, Title } = Typography

const bookingStatusOptions = mapStatusOptions(adminBookingStatusMeta)
const paymentStatusOptions = mapStatusOptions(adminPaymentStatusMeta)

export default function AdminBookingListPage() {
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState<AdminBookingStatus | undefined>()
  const [selectedBookingId, setSelectedBookingId] = useState<number | undefined>()
  const [statusForm] = Form.useForm<{ trangThaiBooking: AdminBookingStatus; trangThaiThanhToan?: AdminPaymentStatus; ghiChu?: string }>()

  const bookingsQuery = useAdminBookings()
  const bookingDetailQuery = useAdminBooking(selectedBookingId)
  const updateBookingStatusMutation = useUpdateAdminBookingStatus()

  const filteredBookings = useMemo(() => {
    const bookings = bookingsQuery.data ?? []
    return bookings.filter((booking) => {
      const normalizedKeyword = keyword.trim().toLowerCase()
      const matchesKeyword = normalizedKeyword.length === 0
        ? true
        : [booking.maBooking, booking.maTour, booking.tenTour, booking.hoTenLienHe, booking.emailLienHe, booking.hoTenNguoiDat]
            .some((value) => value.toLowerCase().includes(normalizedKeyword))

      const matchesStatus = statusFilter === undefined ? true : booking.trangThaiBooking === statusFilter
      return matchesKeyword && matchesStatus
    })
  }, [bookingsQuery.data, keyword, statusFilter])

  const columns: ColumnsType<AdminBookingItem> = [
    {
      title: 'Booking',
      key: 'booking',
      width: 220,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text strong>{record.maBooking}</Text>
          <Text className="admin-muted">{record.hoTenNguoiDat}</Text>
          <Text className="admin-muted">{record.emailNguoiDat}</Text>
        </div>
      ),
    },
    {
      title: 'Tour',
      key: 'tour',
      width: 260,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text strong>{record.tenTour}</Text>
          <Text className="admin-muted">{record.maTour} • {record.maDotTour}</Text>
          <Text className="admin-muted">Khởi hành {formatDate(record.ngayKhoiHanh)}</Text>
        </div>
      ),
    },
    {
      title: 'Liên hệ',
      key: 'contact',
      width: 220,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text>{record.hoTenLienHe}</Text>
          <Text className="admin-muted">{record.soDienThoaiLienHe}</Text>
          <Text className="admin-muted">{record.emailLienHe}</Text>
        </div>
      ),
    },
    {
      title: 'Hành khách',
      key: 'travellers',
      width: 130,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text strong>{record.tongHanhKhach}</Text>
          <Text className="admin-muted">NL {record.soNguoiLon} • TE {record.soTreEm} • EB {record.soEmBe}</Text>
        </div>
      ),
    },
    {
      title: 'Thanh toán',
      key: 'finance',
      width: 180,
      render: (_, record) => (
        <div className="admin-table-stack">
          <Text className="admin-price">{formatMoney(record.tongTien)}</Text>
          <Tag color={adminPaymentStatusMeta[record.trangThaiThanhToan].color}>{adminPaymentStatusMeta[record.trangThaiThanhToan].label}</Tag>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThaiBooking',
      key: 'trangThaiBooking',
      width: 150,
      render: (value: AdminBookingStatus) => <Tag color={adminBookingStatusMeta[value].color}>{adminBookingStatusMeta[value].label}</Tag>,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'ngayDat',
      key: 'ngayDat',
      width: 140,
      render: (value: string) => formatDate(value),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 220,
      fixed: 'right',
      render: (_, record) => (
        <div className="admin-action-stack">
          <Button onClick={() => {
            setSelectedBookingId(record.id)
            statusForm.setFieldsValue({
              trangThaiBooking: record.trangThaiBooking,
              trangThaiThanhToan: record.trangThaiThanhToan,
              ghiChu: record.ghiChu ?? undefined,
            })
          }}>
            Xem chi tiết
          </Button>
          <Button
            type="primary"
            className="admin-primary-button"
            onClick={() => void updateBookingStatusMutation.mutateAsync({
              id: record.id,
              payload: {
                trangThaiBooking: record.trangThaiBooking === 'da_xac_nhan' ? 'hoan_tat' : 'da_xac_nhan',
                trangThaiThanhToan: record.trangThaiThanhToan,
                ghiChu: record.ghiChu ?? undefined,
              },
            })}
          >
            {record.trangThaiBooking === 'da_xac_nhan' ? 'Hoàn tất' : 'Xác nhận'}
          </Button>
        </div>
      ),
    },
  ]

  const hasError = bookingsQuery.isError
  const errorMessage = bookingsQuery.error instanceof Error ? bookingsQuery.error.message : 'Không thể tải dữ liệu booking quản trị'

  const selectedBooking = bookingDetailQuery.data

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <Title level={1}>Quản lý booking</Title>
          <Paragraph>Theo dõi trạng thái đặt tour, thanh toán và thông tin hành khách từ một nơi.</Paragraph>
        </div>
      </div>

      <div className="admin-page-card">
        <div className="admin-filter-toolbar is-compact">
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm theo mã booking, tour, khách hàng..."
            className="admin-filter-field"
          />
          <Select
            allowClear
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            options={bookingStatusOptions}
            placeholder="Trạng thái booking"
            className="admin-filter-field"
          />
          <Button className="admin-filter-button" onClick={() => {
            setKeyword('')
            setStatusFilter(undefined)
          }}>
            Xoá bộ lọc
          </Button>
        </div>

        {hasError ? <Alert type="error" showIcon title={errorMessage} /> : null}

        <Table
          rowKey="id"
          columns={columns}
          dataSource={filteredBookings}
          loading={bookingsQuery.isLoading}
          pagination={{ pageSize: 8, showSizeChanger: false }}
          locale={{ emptyText: <Empty description="Chưa có booking quản trị" /> }}
          scroll={{ x: 1600 }}
          className="admin-table"
        />
      </div>

      <Drawer
        title={selectedBooking ? `Chi tiết booking ${selectedBooking.maBooking}` : 'Chi tiết booking'}
        open={selectedBookingId !== undefined}
        onClose={() => setSelectedBookingId(undefined)}
        width={720}
        destroyOnClose
      >
        {bookingDetailQuery.isLoading ? <Paragraph>Đang tải chi tiết booking...</Paragraph> : null}
        {bookingDetailQuery.isError ? (
          <Alert
            type="error"
            showIcon
            title={bookingDetailQuery.error instanceof Error ? bookingDetailQuery.error.message : 'Không thể tải chi tiết booking'}
          />
        ) : null}

        {selectedBooking ? (
          <Space orientation="vertical" size={20} style={{ width: '100%' }}>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Mã booking">{selectedBooking.maBooking}</Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">{formatDateTime(selectedBooking.ngayDat)}</Descriptions.Item>
              <Descriptions.Item label="Tour">{selectedBooking.tenTour}</Descriptions.Item>
              <Descriptions.Item label="Mã tour">{selectedBooking.maTour}</Descriptions.Item>
              <Descriptions.Item label="Lịch khởi hành">{formatDate(selectedBooking.ngayKhoiHanh)} - {formatDate(selectedBooking.ngayKetThuc)}</Descriptions.Item>
              <Descriptions.Item label="Liên hệ">{selectedBooking.hoTenLienHe} • {selectedBooking.soDienThoaiLienHe}</Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">{formatMoney(selectedBooking.tongTien)}</Descriptions.Item>
              <Descriptions.Item label="Đã thanh toán">{formatMoney(selectedBooking.soTienDaThanhToan)}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái booking">
                <Tag color={adminBookingStatusMeta[selectedBooking.trangThaiBooking].color}>{adminBookingStatusMeta[selectedBooking.trangThaiBooking].label}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái thanh toán">
                <Tag color={adminPaymentStatusMeta[selectedBooking.trangThaiThanhToan].color}>{adminPaymentStatusMeta[selectedBooking.trangThaiThanhToan].label}</Tag>
              </Descriptions.Item>
            </Descriptions>

            <div>
              <Title level={4}>Danh sách hành khách</Title>
              {selectedBooking.hanhKhachs.length === 0 ? (
                <div className="admin-empty-block">
                  <Empty description="Chưa có thông tin hành khách" />
                </div>
              ) : (
                <div className="admin-drawer-list">
                  {selectedBooking.hanhKhachs.map((traveller) => (
                    <div key={traveller.id} className="admin-drawer-item">
                      <Space orientation="vertical" size={4}>
                        <Text strong>{traveller.hoTen}</Text>
                        <Text className="admin-muted">{traveller.loaiKhach} • {traveller.gioiTinh || 'Chưa rõ giới tính'}</Text>
                        <Text className="admin-muted">{traveller.quocTich || 'Chưa có quốc tịch'} • {traveller.soGiayTo || 'Chưa có giấy tờ'}</Text>
                      </Space>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Title level={4}>Cập nhật trạng thái</Title>
              <Form
                form={statusForm}
                layout="vertical"
                onFinish={(values) => void updateBookingStatusMutation.mutateAsync({ id: selectedBooking.id, payload: values })}
              >
                <div className="admin-modal-grid">
                  <Form.Item name="trangThaiBooking" label="Trạng thái booking" rules={[{ required: true, message: 'Vui lòng chọn trạng thái booking' }]}>
                    <Select options={bookingStatusOptions} />
                  </Form.Item>
                  <Form.Item name="trangThaiThanhToan" label="Trạng thái thanh toán">
                    <Select allowClear options={paymentStatusOptions} />
                  </Form.Item>
                  <Form.Item name="ghiChu" label="Ghi chú" className="full-width">
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </div>
                <Button type="primary" htmlType="submit" loading={updateBookingStatusMutation.isPending} className="admin-primary-button">
                  Lưu cập nhật
                </Button>
              </Form>
            </div>
          </Space>
        ) : null}
      </Drawer>
    </div>
  )
}
