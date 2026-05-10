import './MyBookingDetailPage.css'
import { Alert, Card, Empty, List, Skeleton, Tag, Typography, Row, Col, Divider, Steps, Button, Modal, Input } from 'antd'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { useState } from 'react'
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
  FileTextOutlined,
  BarcodeOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  EditOutlined
} from '@ant-design/icons'
import { PATHS } from '../constants/paths'
import { formatDate } from '../utils/formatDate'
import { formatMoney } from '../utils/formatMoney'
import { API_BASE_URL } from '../constants/api'
import { useAuthStore } from '../store/authStore'
import { layChiTietBooking, layThanhToanTheoBooking, type BookingPassenger } from '../services/booking/booking'
import { taoYeuCauHuyTour, layYeuCauHuyTourTheoBooking } from '../services/huy-tour/huyTour'
import { PassengerEditDrawer } from '../components/booking/PassengerEditDrawer'
import { ChatBox } from '../components/chat/ChatBox'

const { Paragraph, Title, Text } = Typography
const { TextArea } = Input

function handleDownload(url: string, filename: string) {
  const token = useAuthStore.getState().accessToken
  fetch(`${API_BASE_URL}${url}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((r) => {
      if (!r.ok) throw new Error('Tải thất bại')
      return r.blob()
    })
    .then((blob) => {
      const objUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objUrl
      a.download = filename
      a.click()
      window.URL.revokeObjectURL(objUrl)
    })
    .catch(() => {})
}

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
  const queryClient = useQueryClient()
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelSubmitting, setCancelSubmitting] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [editingPassenger, setEditingPassenger] = useState<BookingPassenger | null>(null)

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

  const cancelQuery = useQuery({
    queryKey: ['cancellation-request', bookingId],
    queryFn: () => layYeuCauHuyTourTheoBooking(bookingId),
    enabled: isValidBookingId,
  })

  const handleCancelSubmit = async () => {
    if (!cancelReason.trim()) return
    setCancelSubmitting(true)
    setCancelError(null)
    try {
      await taoYeuCauHuyTour({ bookingId, lyDo: cancelReason.trim() })
      setCancelModalOpen(false)
      setCancelReason('')
      queryClient.invalidateQueries({ queryKey: ['cancellation-request', bookingId] })
    } catch (e) {
      setCancelError((e as Error).message)
    } finally {
      setCancelSubmitting(false)
    }
  }

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
          <div className="booking-detail-wrapper">
            
            {/* 1. HERO HEADER */}
            <div className="booking-hero-card">
              <div className="booking-hero-content">
                <div className="hero-top-row">
                  <Tag className={`hero-status-tag ${bookingQuery.data.trangThaiBooking}`} color={bookingQuery.data.trangThaiBooking === 'hoan_tat' ? 'success' : 'processing'}>
                    {formatTrangThai(bookingQuery.data.trangThaiBooking)}
                  </Tag>
                  <div className="hero-booking-id"><BarcodeOutlined /> #{bookingQuery.data.maBooking}</div>
                </div>
                <Title level={1} className="hero-tour-title">{bookingQuery.data.tenTour}</Title>
                <div className="hero-meta">
                  <Text className="hero-date"><CalendarOutlined /> Đặt ngày: {formatDate(bookingQuery.data.ngayDat)}</Text>
                  <Tag color={bookingQuery.data.trangThaiThanhToan === 'da_thanh_toan' ? 'success' : 'warning'} className="payment-status-tag">
                    {formatTrangThai(bookingQuery.data.trangThaiThanhToan)}
                  </Tag>
                </div>
              </div>
            </div>

            <Row gutter={[32, 32]} className="booking-content-row">
              {/* 2. MAIN CONTENT LEFT */}
              <Col xs={24} lg={15} xl={16}>
                <div className="detail-cards-stack">
                  
                  {/* Timeline & Tour Info */}
                  <Card className="detail-card" title={<span><EnvironmentOutlined /> Hành trình & Thông tin</span>} bordered={false}>
                    <div className="tour-info-grid">
                      <div className="tour-timeline">
                        <Steps
                          direction="vertical"
                          current={1}
                          items={[
                            { title: 'Khởi hành', description: formatDate(bookingQuery.data.ngayKhoiHanh), status: 'process' },
                            { title: 'Kết thúc', description: formatDate(bookingQuery.data.ngayKetThuc), status: 'finish' },
                          ]}
                        />
                      </div>
                      <div className="tour-meta-grid">
                        <div className="meta-box">
                          <Text type="secondary" className="meta-label">Mã đợt tour</Text>
                          <Text strong className="meta-value">{bookingQuery.data.maDotTour}</Text>
                        </div>
                        <div className="meta-box">
                          <Text type="secondary" className="meta-label">Địa điểm</Text>
                          <Text strong className="meta-value">{bookingQuery.data.diaChiLienHe || 'Theo lịch trình'}</Text>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Contact Info */}
                  <Card className="detail-card" title={<span><UserOutlined /> Thông tin liên hệ</span>} bordered={false}>
                    <Row gutter={[24, 24]}>
                      <Col xs={24} sm={12}>
                        <div className="contact-box">
                          <div className="contact-icon-wrap"><UserOutlined /></div>
                          <div className="contact-text">
                            <Text type="secondary">Người liên hệ</Text>
                            <Text strong>{bookingQuery.data.hoTenLienHe}</Text>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} sm={12}>
                        <div className="contact-box">
                          <div className="contact-icon-wrap"><PhoneOutlined /></div>
                          <div className="contact-text">
                            <Text type="secondary">Số điện thoại</Text>
                            <Text strong>{bookingQuery.data.soDienThoaiLienHe}</Text>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} sm={24}>
                        <div className="contact-box">
                          <div className="contact-icon-wrap"><MailOutlined /></div>
                          <div className="contact-text">
                            <Text type="secondary">Email</Text>
                            <Text strong>{bookingQuery.data.emailLienHe}</Text>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card>

                  {/* Passengers */}
                  <Card className="detail-card" title={<span><IdcardOutlined /> Danh sách hành khách ({bookingQuery.data.tongHanhKhach})</span>} bordered={false}>
                    <List
                      dataSource={bookingQuery.data.hanhKhachs}
                      renderItem={(item, index) => {
                        const isEditable = bookingQuery.data.trangThaiBooking === 'da_xac_nhan' &&
                          new Date(bookingQuery.data.ngayKhoiHanh) > new Date()
                        return (
                          <List.Item
                            className="passenger-list-item"
                            actions={[
                              <Button
                                key="edit"
                                type="text"
                                icon={<EditOutlined />}
                                onClick={() => setEditingPassenger(item)}
                                disabled={!isEditable}
                                title={isEditable ? 'Chỉnh sửa thông tin' : 'Chỉ có thể chỉnh sửa khi booking đã xác nhận và chưa khởi hành'}
                              >
                                Sửa
                              </Button>
                            ]}
                          >
                            <List.Item.Meta
                              avatar={<div className="passenger-avatar">{index + 1}</div>}
                              title={<Text className="passenger-name">{item.hoTen}</Text>}
                              description={
                                <div className="passenger-desc">
                                  <Tag className="passenger-type-tag">{formatTrangThai(item.loaiKhach)}</Tag>
                                  <Text className="passenger-meta">{item.gioiTinh} • {item.quocTich || 'Việt Nam'}</Text>
                                </div>
                              }
                            />
                          </List.Item>
                        )
                      }}
                    />
                  </Card>

                  {/* Passenger Edit Drawer */}
                  <PassengerEditDrawer
                    open={!!editingPassenger}
                    bookingId={bookingQuery.data.id}
                    passenger={editingPassenger}
                    onClose={() => setEditingPassenger(null)}
                  />

                </div>
              </Col>

              {/* 3. SIDEBAR RIGHT (RECEIPT & ACTIONS) */}
              <Col xs={24} lg={9} xl={8}>
                <div className="sidebar-sticky">
                  
                  {/* Receipt Card */}
                  <div className="receipt-card">
                    <div className="receipt-header">
                      <CreditCardOutlined className="receipt-icon" /> Tóm tắt thanh toán
                    </div>
                    
                    <div className="receipt-body">
                      <div className="receipt-rows">
                        <div className="receipt-row">
                          <Text>Người lớn x {bookingQuery.data.soNguoiLon}</Text>
                          <Text strong>{formatMoney(bookingQuery.data.donGiaNguoiLon * bookingQuery.data.soNguoiLon)}</Text>
                        </div>
                        {bookingQuery.data.soTreEm > 0 && (
                          <div className="receipt-row">
                            <Text>Trẻ em x {bookingQuery.data.soTreEm}</Text>
                            <Text strong>{formatMoney(bookingQuery.data.donGiaTreEm * bookingQuery.data.soTreEm)}</Text>
                          </div>
                        )}
                        {bookingQuery.data.soEmBe > 0 && (
                          <div className="receipt-row">
                            <Text>Em bé x {bookingQuery.data.soEmBe}</Text>
                            <Text strong>{formatMoney(bookingQuery.data.donGiaEmBe * bookingQuery.data.soEmBe)}</Text>
                          </div>
                        )}
                      </div>

                      <Divider dashed className="receipt-divider" />

                      <div className="receipt-rows">
                        <div className="receipt-row">
                          <Text>Tạm tính</Text>
                          <Text strong>{formatMoney(bookingQuery.data.tamTinh)}</Text>
                        </div>
                        {bookingQuery.data.giamGia > 0 && (
                          <div className="receipt-row discount">
                            <Text>Giảm giá {bookingQuery.data.maVoucher ? `(${bookingQuery.data.maVoucher})` : ''}</Text>
                            <Text strong>-{formatMoney(bookingQuery.data.giamGia)}</Text>
                          </div>
                        )}
                      </div>

                      <div className="receipt-total-box">
                        <Text className="total-label">Cần thanh toán</Text>
                        <Title level={2} className="total-value">{formatMoney(bookingQuery.data.tongTien)}</Title>
                      </div>

                      <div className="receipt-progress-box">
                        <div className="progress-row">
                          <Text className="progress-label">Đã thanh toán</Text>
                          <Text strong className="progress-paid">{formatMoney(bookingQuery.data.soTienDaThanhToan)}</Text>
                        </div>
                        <div className="progress-bar-bg">
                          <div 
                            className="progress-bar-fill" 
                            style={{ width: `${Math.min(100, (bookingQuery.data.soTienDaThanhToan / bookingQuery.data.tongTien) * 100)}%` }}
                          ></div>
                        </div>
                        {bookingQuery.data.tongTien > bookingQuery.data.soTienDaThanhToan && (
                          <div className="progress-row progress-remaining">
                            <Text>Còn lại</Text>
                            <Text strong>{formatMoney(bookingQuery.data.tongTien - bookingQuery.data.soTienDaThanhToan)}</Text>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* History Section inside Receipt */}
                    <div className="receipt-history">
                      <div className="history-title"><ClockCircleOutlined /> Lịch sử giao dịch</div>
                      {paymentQuery.isLoading ? <Skeleton active paragraph={{ rows: 2 }} /> : (
                        <div className="history-list">
                          {(paymentQuery.data ?? []).length === 0 ? (
                            <div className="history-empty">Chưa có giao dịch nào</div>
                          ) : (
                            paymentQuery.data?.map((payment) => (
                              <div key={payment.id} className="history-item">
                                <div className="history-icon-box">
                                  {payment.trangThai === 'da_thanh_toan' ? <CheckCircleOutlined className="success-icon" /> : <SyncOutlined spin className="processing-icon" />}
                                </div>
                                <div className="history-info">
                                  <Text strong className="history-amount">{formatMoney(payment.soTien)}</Text>
                                  <Text className="history-time">{formatTrangThai(payment.phuongThucThanhToan)} • {formatDate(payment.thoiGianTao)}</Text>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="booking-actions">
                    {/* Confirmation PDF - hiển thị khi booking chưa hủy */}
                    {bookingQuery.data.trangThaiBooking !== 'da_huy' && (
                      <Button
                        type="primary"
                        block
                        size="large"
                        icon={<DownloadOutlined />}
                        className="btn-download-primary"
                        onClick={() => handleDownload(`/api/booking/export-confirmation/${bookingId}`, `XacNhanBooking_${bookingId}.pdf`)}
                      >
                        Tải xác nhận booking
                      </Button>
                    )}

                    {/* Invoice PDF - chỉ hiển thị khi đã thanh toán đủ */}
                    {bookingQuery.data.trangThaiThanhToan === 'da_thanh_toan_het' && (
                      <Button
                        block
                        size="large"
                        icon={<FileTextOutlined />}
                        className="btn-download-secondary"
                        onClick={() => handleDownload(`/api/booking/export-invoice/${bookingId}`, `HoaDon_${bookingId}.pdf`)}
                      >
                        Tải hóa đơn (PDF)
                      </Button>
                    )}

                    {bookingQuery.data.coTheDanhGia && (
                      <Link to={`${PATHS.myReviews}?bookingId=${bookingQuery.data.id}`}>
                        <Button block type="dashed" size="large" className="btn-review">
                          Viết đánh giá cho chuyến đi
                        </Button>
                      </Link>
                    )}
                  </div>

                  {/* Chat Support */}
                  <div style={{ marginTop: 24 }}>
                    <ChatBox bookingId={bookingQuery.data.id} />
                  </div>

                  {/* Cancellation */}
                  {bookingQuery.data.trangThaiBooking !== 'da_huy' && (
                    <div className="cancellation-box">
                      {cancelQuery.isLoading ? <Skeleton active paragraph={{ rows: 1 }} /> : cancelQuery.data ? (
                        <div className="cancel-status-wrap">
                          <ExclamationCircleOutlined className="cancel-icon" />
                          <div className="cancel-content">
                            <Tag color={
                              cancelQuery.data.trangThai === 'cho_duyet' ? 'processing' :
                              cancelQuery.data.trangThai === 'da_duyet' ? 'success' : 'error'
                            }>
                              {cancelQuery.data.trangThai === 'cho_duyet' ? 'Yêu cầu hủy đang chờ duyệt' :
                               cancelQuery.data.trangThai === 'da_duyet' ? 'Đã duyệt hủy tour' : 'Yêu cầu hủy bị từ chối'}
                            </Tag>
                            <Text className="cancel-reason-text">Lý do: {cancelQuery.data.lyDo}</Text>
                            {cancelQuery.data.ghiChuAdmin && (
                              <Text className="cancel-admin-note">Phản hồi: {cancelQuery.data.ghiChuAdmin}</Text>
                            )}
                          </div>
                        </div>
                      ) : (
                        <Button
                          type="text"
                          danger
                          block
                          icon={<CloseCircleOutlined />}
                          onClick={() => setCancelModalOpen(true)}
                          className="btn-cancel"
                        >
                          Yêu cầu hủy tour
                        </Button>
                      )}
                    </div>
                  )}

                </div>
              </Col>
            </Row>

            <Modal
              title="Gửi yêu cầu hủy tour"
              open={cancelModalOpen}
              onCancel={() => { setCancelModalOpen(false); setCancelReason(''); setCancelError(null) }}
              onOk={handleCancelSubmit}
              confirmLoading={cancelSubmitting}
              okText="Gửi yêu cầu"
              cancelText="Đóng"
              okButtonProps={{ danger: true }}
              className="cancel-modal"
            >
              <Text>Vui lòng nhập lý do bạn muốn hủy chuyến đi này. Yêu cầu sẽ được gửi đến bộ phận chăm sóc khách hàng để xử lý.</Text>
              <TextArea
                rows={4}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Ví dụ: Bận việc đột xuất, vấn đề sức khỏe..."
                style={{ marginTop: 16 }}
                maxLength={1000}
              />
              {cancelError && <Alert type="error" message={cancelError} style={{ marginTop: 12 }} />}
            </Modal>
          </div>
        ) : null}
      </div>
    </div>
  )
}
