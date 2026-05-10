import { Alert, Button, Descriptions, Drawer, Empty, Form, Input, Popconfirm, Select, Space, Tag, Typography, Modal, Pagination, Dropdown, Tooltip } from 'antd'
import type { MenuProps } from 'antd'
import { useMemo, useState, useEffect } from 'react'
import { useAdminBooking, useAdminBookings, useUpdateAdminBookingStatus } from '../../services/admin/admin.hooks'
import type { AdminBookingItem, AdminBookingStatus, AdminPaymentStatus } from '../../types/admin'
import { formatDate } from '../../utils/formatDate'
import { formatMoney } from '../../utils/formatMoney'
import { adminBookingStatusMeta, adminPaymentStatusMeta, formatDateTime, mapStatusOptions } from '../../utils/admin'
import { API_BASE_URL } from '../../constants/api'
import { useAuthStore } from '../../store/authStore'
import { MoreOutlined, FilePdfOutlined, CheckCircleOutlined, InfoCircleOutlined, AppstoreOutlined, ClockCircleOutlined, CloseCircleOutlined, BookOutlined, EyeOutlined, SearchOutlined, MailOutlined, BarcodeOutlined, CalendarOutlined, TeamOutlined, PhoneOutlined } from '@ant-design/icons'
import './AdminBookingListPage.css'

const { Paragraph, Text, Title } = Typography

const bookingStatusOptions = mapStatusOptions(adminBookingStatusMeta)
const paymentStatusOptions = mapStatusOptions(adminPaymentStatusMeta)

export default function AdminBookingListPage() {
  const [keyword, setKeyword] = useState('')
  const [bookingStatusFilter, setBookingStatusFilter] = useState<AdminBookingStatus | undefined>()
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<AdminPaymentStatus | undefined>()
  const [selectedBookingId, setSelectedBookingId] = useState<number | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 8

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

      const matchesBookingStatus = bookingStatusFilter === undefined || booking.trangThaiBooking === bookingStatusFilter
      const matchesPaymentStatus = paymentStatusFilter === undefined || booking.trangThaiThanhToan === paymentStatusFilter
      return matchesKeyword && matchesBookingStatus && matchesPaymentStatus
    })
  }, [bookingsQuery.data, keyword, bookingStatusFilter, paymentStatusFilter])

  const stats = useMemo(() => {
    const bookings = bookingsQuery.data ?? []
    return {
      total: bookings.length,
      waiting: bookings.filter(b => b.trangThaiBooking === 'cho_xac_nhan').length,
      success: bookings.filter(b => b.trangThaiBooking === 'da_xac_nhan' || b.trangThaiBooking === 'hoan_tat').length,
      cancelled: bookings.filter(b => b.trangThaiBooking === 'da_huy' || b.trangThaiBooking === 'tu_choi').length,
    }
  }, [bookingsQuery.data])

  useEffect(() => {
    setCurrentPage(1)
  }, [keyword, bookingStatusFilter, paymentStatusFilter])

  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredBookings.slice(start, start + pageSize)
  }, [filteredBookings, currentPage])

  const handleExportPdf = async (booking: AdminBookingItem) => {
    try {
      const token = useAuthStore.getState().accessToken
      const response = await fetch(`${API_BASE_URL}/admin/booking/export-invoice/${booking.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error('Không thể xuất hóa đơn')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `HoaDon_${booking.maBooking}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      Modal.error({ title: 'Lỗi', content: 'Không thể xuất hóa đơn. Vui lòng thử lại.' })
    }
  }

  const handleStatusChange = async (booking: AdminBookingItem, newStatus: AdminBookingStatus) => {
    Modal.confirm({
      title: newStatus === 'hoan_tat' ? 'Hoàn tất booking?' : 'Xác nhận booking?',
      content: newStatus === 'hoan_tat'
        ? 'Booking sẽ được đánh dấu là hoàn tất. Bạn không thể hoàn tác.'
        : 'Booking sẽ được xác nhận và khách hàng sẽ được thông báo.',
      okText: newStatus === 'hoan_tat' ? 'Hoàn tất' : 'Xác nhận',
      cancelText: 'Hủy',
      onOk: async () => {
        await updateBookingStatusMutation.mutateAsync({
          id: booking.id,
          payload: {
            trangThaiBooking: newStatus,
            trangThaiThanhToan: booking.trangThaiThanhToan,
            ghiChu: booking.ghiChu ?? undefined,
          },
        })
      }
    })
  }

  const getBookingActions = (record: AdminBookingItem): MenuProps['items'] => {
    const items: MenuProps['items'] = [
      {
        key: 'pdf',
        label: 'Xuất PDF',
        icon: <FilePdfOutlined />,
        onClick: () => void handleExportPdf(record)
      },
      { type: 'divider' },
    ]

    if (record.trangThaiBooking === 'cho_xac_nhan') {
      items.push({
        key: 'confirm',
        label: 'Xác nhận booking',
        icon: <CheckCircleOutlined />,
        onClick: () => void handleStatusChange(record, 'da_xac_nhan')
      })
    } else if (record.trangThaiBooking === 'da_xac_nhan') {
      items.push({
        key: 'complete',
        label: 'Hoàn tất booking',
        icon: <CheckCircleOutlined />,
        onClick: () => void handleStatusChange(record, 'hoan_tat')
      })
    }

    return items
  }

  const hasError = bookingsQuery.isError
  const errorMessage = bookingsQuery.error instanceof Error ? bookingsQuery.error.message : 'Không thể tải dữ liệu booking quản trị'

  const selectedBooking = bookingDetailQuery.data

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div className="booking-title-wrapper">
          <div className="booking-header-icon">
            <BookOutlined />
          </div>
          <div>
            <Title level={1}>Quản lý booking</Title>
            <Paragraph>Theo dõi trạng thái đặt tour, thanh toán và thông tin hành khách từ một nơi.</Paragraph>
          </div>
        </div>
      </div>

      <div className="admin-page-card" style={{ padding: '32px' }}>
        <div className="booking-stats-grid">
          <div className="booking-stat-card">
            <div className="stat-icon"><AppstoreOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Tổng booking</div>
            </div>
          </div>
          <div className="booking-stat-card waiting-stat">
            <div className="stat-icon"><ClockCircleOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.waiting}</div>
              <div className="stat-label">Chờ xác nhận</div>
            </div>
          </div>
          <div className="booking-stat-card success-stat">
            <div className="stat-icon"><CheckCircleOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.success}</div>
              <div className="stat-label">Thành công</div>
            </div>
          </div>
          <div className="booking-stat-card cancelled-stat">
            <div className="stat-icon"><CloseCircleOutlined /></div>
            <div className="stat-content">
              <div className="stat-value">{stats.cancelled}</div>
              <div className="stat-label">Huỷ / Từ chối</div>
            </div>
          </div>
        </div>

        <div className="booking-filter-card">
          <div className="booking-filter-toolbar">
            <Input
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm theo mã booking, tour, khách hàng..."
            />
            <Select
              allowClear
              value={bookingStatusFilter}
              onChange={(value) => setBookingStatusFilter(value)}
              options={bookingStatusOptions}
              placeholder="Trạng thái booking"
            />
            <Select
              allowClear
              value={paymentStatusFilter}
              onChange={(value) => setPaymentStatusFilter(value)}
              options={paymentStatusOptions}
              placeholder="Trạng thái thanh toán"
            />
            <Button onClick={() => {
              setKeyword('')
              setBookingStatusFilter(undefined)
              setPaymentStatusFilter(undefined)
            }}>
              Xoá bộ lọc
            </Button>
          </div>
        </div>

        {hasError ? <Alert type="error" showIcon title={errorMessage} /> : null}

        <div className="admin-booking-list-container">
          {bookingsQuery.isLoading ? (
            <Empty description="Đang tải dữ liệu..." />
          ) : filteredBookings.length === 0 ? (
            <Empty description="Chưa có booking quản trị" />
          ) : (
            <>
              <div className="booking-list-header">
                <div className="booking-list-header-col booking-header-col-main">Thông tin Booking</div>
                <div className="booking-list-header-col booking-header-col-tour">Lịch trình Tour</div>
                <div className="booking-list-header-col booking-header-col-passengers">Hành khách</div>
                <div className="booking-list-header-col booking-header-col-pricing">Giá & Trạng thái</div>
                <div className="booking-list-header-col booking-header-col-actions">Thao tác</div>
              </div>
              {paginatedBookings.map((booking) => (
              <div key={booking.id} className="booking-list-item">
                <div className="booking-item-main">
                  <div className="booking-text-accent">{booking.maBooking}</div>
                  <div className="booking-text-primary">{booking.hoTenNguoiDat}</div>
                  <div className="booking-text-secondary text-truncate" style={{ maxWidth: 200 }} title={booking.emailNguoiDat}>
                    {booking.emailNguoiDat}
                  </div>
                  <div className="booking-text-secondary" style={{ marginTop: 4 }}>
                    {formatDateTime(booking.ngayDat)}
                  </div>
                </div>

                <div className="booking-item-tour">
                  <div className="booking-tour-name" title={booking.tenTour}>{booking.tenTour}</div>
                  <div className="booking-text-secondary">
                    {booking.maTour} • {booking.maDotTour}
                  </div>
                  <div className="booking-text-secondary" style={{ marginTop: 4 }}>
                    Khởi hành: <Text strong>{formatDate(booking.ngayKhoiHanh)}</Text>
                  </div>
                </div>

                <div className="booking-item-passengers">
                  <div className="booking-text-primary">{booking.tongHanhKhach} Khách</div>
                  <div className="booking-text-secondary">
                    {booking.soNguoiLon} NL • {booking.soTreEm} TE • {booking.soEmBe} EB
                  </div>
                  <div className="booking-text-secondary" style={{ marginTop: 4 }}>
                    LH: {booking.hoTenLienHe}
                  </div>
                </div>

                <div className="booking-item-pricing">
                  <div className="booking-price-text">{formatMoney(booking.tongTien)}</div>
                  <Tag className="booking-status-pill" color={adminPaymentStatusMeta[booking.trangThaiThanhToan].color}>
                    {adminPaymentStatusMeta[booking.trangThaiThanhToan].label}
                  </Tag>
                  <Tag className="booking-status-pill" color={adminBookingStatusMeta[booking.trangThaiBooking].color}>
                    {adminBookingStatusMeta[booking.trangThaiBooking].label}
                  </Tag>
                </div>

                <div className="booking-actions-group">
                  <Tooltip title="Xem chi tiết">
                    <button 
                      className="booking-action-btn edit"
                      onClick={() => {
                        setSelectedBookingId(booking.id)
                        statusForm.setFieldsValue({
                          trangThaiBooking: booking.trangThaiBooking,
                          trangThaiThanhToan: booking.trangThaiThanhToan,
                          ghiChu: booking.ghiChu ?? undefined,
                        })
                      }}
                    >
                      <EyeOutlined />
                    </button>
                  </Tooltip>
                  <Dropdown menu={{ items: getBookingActions(booking) }} trigger={['click']} placement="bottomRight">
                    <button className="booking-action-btn"><MoreOutlined /></button>
                  </Dropdown>
                </div>
              </div>
            ))}
            </>
          )}
        </div>

        {filteredBookings.length > 0 && (
          <div className="admin-booking-list-pagination">
            <Pagination 
              current={currentPage} 
              total={filteredBookings.length} 
              pageSize={pageSize} 
              onChange={(page) => setCurrentPage(page)} 
              showSizeChanger={false}
            />
          </div>
        )}
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
