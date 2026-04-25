import './BookingPage.css'
import { Alert, Button, Card, Checkbox, Col, DatePicker, Form, Input, Row, Select, Skeleton, Space, Typography } from 'antd'
import { CheckOutlined, GiftOutlined, MinusOutlined, RightOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router'
import { formatDate } from '../utils/formatDate'
import { formatMoney } from '../utils/formatMoney'
import { getTourChiTietPath } from '../constants/paths'
import { layDuLieuDatTour, taoBooking, type BookingPassengerPayload } from '../services/booking/booking'
import { useAuthStore } from '../store/authStore'

const { Paragraph, Text, Title } = Typography
const { TextArea } = Input

type StepKey = 'contact' | 'counts' | 'passengers' | 'confirm'
type PassengerType = 'nguoi_lon' | 'tre_em' | 'em_be'

interface BookingContactValues {
  hoTenLienHe: string
  emailLienHe: string
  soDienThoaiLienHe: string
  diaChiLienHe?: string
}

interface PassengerDraft {
  id: string
  loaiKhach: PassengerType
  nhan: string
  hoTen: string
  ngaySinh?: Dayjs | null
  gioiTinh?: string
  soGiayTo?: string
  quocTich?: string
}


const steps = [
  { key: 'contact' as const, label: 'Thông tin liên hệ', icon: <UserOutlined /> },
  { key: 'counts' as const, label: 'Số lượng khách', icon: <TeamOutlined /> },
  { key: 'passengers' as const, label: 'Thông tin hành khách', icon: <TeamOutlined /> },
  { key: 'confirm' as const, label: 'Voucher & Xác nhận', icon: <GiftOutlined /> },
]

const genderOptions = [
  { value: 'Nam', label: 'Nam' },
  { value: 'Nữ', label: 'Nữ' },
  { value: 'Khác', label: 'Khác' },
]


function taoPassengerId(type: PassengerType, index: number) {
  return `${type}-${index + 1}`
}

function buildPassengerDrafts(counts: Record<PassengerType, number>, current: PassengerDraft[]) {
  const byType = {
    nguoi_lon: current.filter((item) => item.loaiKhach === 'nguoi_lon'),
    tre_em: current.filter((item) => item.loaiKhach === 'tre_em'),
    em_be: current.filter((item) => item.loaiKhach === 'em_be'),
  }

  const makeGroup = (type: PassengerType, label: string, count: number) => {
    return Array.from({ length: count }, (_, index) => {
      const existing = byType[type][index]
      return existing ?? {
        id: taoPassengerId(type, index),
        loaiKhach: type,
        nhan: `${label} ${index + 1}`,
        hoTen: '',
        ngaySinh: null,
        gioiTinh: undefined,
        soGiayTo: '',
        quocTich: 'Việt Nam',
      }
    })
  }

  return [
    ...makeGroup('nguoi_lon', 'Người lớn', counts.nguoi_lon),
    ...makeGroup('tre_em', 'Trẻ em', counts.tre_em),
    ...makeGroup('em_be', 'Em bé', counts.em_be),
  ]
}

export default function Booking() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [contactForm] = Form.useForm<BookingContactValues>()
  const [currentStep, setCurrentStep] = useState<StepKey>('contact')
  const [contactInfo, setContactInfo] = useState<BookingContactValues | null>(null)
  const [passengerCounts, setPassengerCounts] = useState<Record<PassengerType, number>>({
    nguoi_lon: 1,
    tre_em: 0,
    em_be: 0,
  })
  const [passengers, setPassengers] = useState<PassengerDraft[]>([])
  const [voucherCode, setVoucherCode] = useState('')
  const [ghiChu, setGhiChu] = useState('')
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const tourId = Number(searchParams.get('tourId'))
  const departureId = Number(searchParams.get('departureId'))
  const isValidParams = Number.isInteger(tourId) && tourId > 0 && Number.isInteger(departureId) && departureId > 0
  const currentUser = useAuthStore((state) => state.currentUser)

  const bookingQuery = useQuery({
    queryKey: ['booking-page', tourId, departureId],
    queryFn: () => layDuLieuDatTour(tourId, departureId),
    enabled: isValidParams,
  })

  const pricingSummary = useMemo(() => {
    if (!bookingQuery.data) {
      return null
    }

    return {
      nguoiLon: bookingQuery.data.pricing.giaNguoiLonNgayThuong ?? bookingQuery.data.tour.giaNguoiLonMacDinh ?? 0,
      treEm: bookingQuery.data.pricing.giaTreEmNgayThuong ?? 0,
      emBe: bookingQuery.data.pricing.giaEmBeNgayThuong ?? 0,
    }
  }, [bookingQuery.data])

  const totalGuests = passengerCounts.nguoi_lon + passengerCounts.tre_em + passengerCounts.em_be

  const tongTamTinh = useMemo(() => {
    if (!pricingSummary) {
      return 0
    }

    return pricingSummary.nguoiLon * passengerCounts.nguoi_lon + pricingSummary.treEm * passengerCounts.tre_em + pricingSummary.emBe * passengerCounts.em_be
  }, [pricingSummary, passengerCounts])

  const stepsIndex = steps.findIndex((item) => item.key === currentStep)

  if (!isValidParams) {
    return (
      <div className="booking-page-state">
        <Alert
          type="warning"
          showIcon
          message="Thiếu thông tin đặt tour"
          description="Vui lòng quay lại trang chi tiết tour và chọn lại lịch khởi hành."
        />
      </div>
    )
  }

  if (bookingQuery.isLoading) {
    return (
      <div className="booking-page">
        <div className="booking-page-container">
          <Skeleton active paragraph={{ rows: 12 }} />
        </div>
      </div>
    )
  }

  if (bookingQuery.isError || !bookingQuery.data || !pricingSummary) {
    return (
      <div className="booking-page-state">
        <Alert
          type="error"
          showIcon
          message="Không thể tải trang đặt tour"
          description="Lịch khởi hành không còn hợp lệ hoặc dữ liệu tour đang tạm thời gián đoạn."
        />
      </div>
    )
  }

  const { tour, departure } = bookingQuery.data
  const soChoConLai = Math.max(departure.soChoConLai, 0)

  const capNhatSoLuong = (type: PassengerType, delta: number) => {
    setErrorMessage(null)

    setPassengerCounts((prev) => {
      const nextValue = Math.max(type === 'nguoi_lon' ? 1 : 0, prev[type] + delta)
      const next = { ...prev, [type]: nextValue }
      const total = next.nguoi_lon + next.tre_em + next.em_be

      if (total > soChoConLai) {
        setErrorMessage(`Số khách vượt quá số chỗ còn nhận của lịch này (${soChoConLai} chỗ).`)
        return prev
      }

      const nextPassengers = buildPassengerDrafts(next, passengers)
      setPassengers(nextPassengers)
      return next
    })
  }

  const xuLyQuaBuocSoLuong = () => {
    setErrorMessage(null)

    if (totalGuests > soChoConLai) {
      setErrorMessage(`Số khách vượt quá số chỗ còn lại của lịch khởi hành (${soChoConLai} chỗ).`)
      return
    }

    setPassengers((prev) => buildPassengerDrafts(passengerCounts, prev))
    setCurrentStep('passengers')
  }

  const capNhatPassenger = (id: string, field: keyof PassengerDraft, value: string | Dayjs | null | undefined) => {
    setPassengers((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const xacNhanThongTinHanhKhach = () => {
    const invalidPassenger = passengers.find((item) => !item.hoTen.trim() || !item.gioiTinh)

    if (invalidPassenger) {
      setErrorMessage('Vui lòng nhập đầy đủ họ tên và giới tính cho tất cả hành khách.')
      return
    }

    setErrorMessage(null)
    setCurrentStep('confirm')
  }

  const xuLyQuaBuocLienHe = async () => {
    try {
      const values = await contactForm.validateFields()
      setContactInfo(values)
      setErrorMessage(null)
      setCurrentStep('counts')
    } catch {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin liên hệ trước khi tiếp tục.')
    }
  }

  const taoPayloadHanhKhach = (): BookingPassengerPayload[] => {
    return passengers.map((item) => ({
      hoTen: item.hoTen.trim(),
      loaiKhach: item.loaiKhach,
      ngaySinh: item.ngaySinh ? item.ngaySinh.format('YYYY-MM-DDTHH:mm:ss') : undefined,
      gioiTinh: item.gioiTinh,
      soGiayTo: item.soGiayTo?.trim() || undefined,
      quocTich: item.quocTich?.trim() || undefined,
    }))
  }

  const handleSubmit = async () => {
    if (!contactInfo) {
      setErrorMessage('Thiếu thông tin liên hệ.')
      return
    }

    if (!acceptedTerms) {
      setErrorMessage('Bạn cần đồng ý điều khoản và điều kiện trước khi đặt tour.')
      return
    }

    try {
      setSubmitting(true)
      setErrorMessage(null)
      setSuccessMessage(null)

      const response = await taoBooking({
        lichKhoiHanhId: departure.id,
        hoTenLienHe: contactInfo.hoTenLienHe,
        emailLienHe: contactInfo.emailLienHe,
        soDienThoaiLienHe: contactInfo.soDienThoaiLienHe,
        diaChiLienHe: contactInfo.diaChiLienHe,
        soNguoiLon: passengerCounts.nguoi_lon,
        soTreEm: passengerCounts.tre_em,
        soEmBe: passengerCounts.em_be,
        phuongThucThanhToanDuKien: 'chuyen_khoan',
        maVoucher: voucherCode,
        hanhKhachs: taoPayloadHanhKhach(),
        ghiChu,
      })

      setSuccessMessage(`Đặt tour thành công. Mã booking của bạn là ${response.maBooking}.`)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Đặt tour thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStepContent = () => {
    if (currentStep === 'contact') {
      return (
        <Card className="booking-card" variant="borderless">
          <Title className="booking-section-title">Thông tin liên hệ</Title>
          <Form
            form={contactForm}
            layout="vertical"
            className="booking-form"
            autoComplete="off"
            initialValues={{
              hoTenLienHe: currentUser?.hoTen ?? '',
              emailLienHe: currentUser?.email ?? '',
              soDienThoaiLienHe: '',
              diaChiLienHe: '',
            }}
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item label="Họ và tên *" name="hoTenLienHe" rules={[{ required: true, message: 'Vui lòng nhập họ tên đầy đủ' }]}>
                  <Input size="large" placeholder="Nhập họ tên đầy đủ" className="booking-input" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Số điện thoại *"
                  name="soDienThoaiLienHe"
                  rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                    { pattern: /^\d{10}$/, message: 'Số điện thoại phải đúng 10 chữ số' },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="Nhập số điện thoại"
                    className="booking-input"
                    maxLength={10}
                    inputMode="numeric"
                    onChange={(event) => {
                      const onlyDigits = event.target.value.replace(/\D/g, '').slice(0, 10)
                      contactForm.setFieldValue('soDienThoaiLienHe', onlyDigits)
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Email *"
                  name="emailLienHe"
                  rules={[
                    { required: true, message: 'Vui lòng nhập email' },
                    { type: 'email', message: 'Email không hợp lệ' },
                  ]}
                >
                  <Input size="large" placeholder="Nhập email" className="booking-input" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="Địa chỉ" name="diaChiLienHe">
                  <Input size="large" placeholder="Nhập địa chỉ" className="booking-input" />
                </Form.Item>
              </Col>
            </Row>

            <div className="booking-actions-row booking-actions-row-end">
              <Button type="primary" size="large" className="booking-primary-button" onClick={xuLyQuaBuocLienHe}>
                Tiếp tục <RightOutlined />
              </Button>
            </div>
          </Form>
        </Card>
      )
    }

    if (currentStep === 'counts') {
      return (
        <Card className="booking-card" variant="borderless">
          <Title className="booking-section-title">Chọn số lượng khách</Title>
          <div className="booking-count-list">
            {[
              { type: 'nguoi_lon' as const, title: 'Người lớn', note: 'Từ 11 tuổi trở lên', price: pricingSummary.nguoiLon },
              { type: 'tre_em' as const, title: 'Trẻ em', note: 'Từ 5-10 tuổi', price: pricingSummary.treEm },
              { type: 'em_be' as const, title: 'Em bé', note: 'Dưới 5 tuổi', price: pricingSummary.emBe },
            ].map((item) => (
              <div key={item.type} className="booking-count-list-item">
                <div className="booking-count-info">
                  <Title level={4} className="booking-count-title">{item.title}</Title>
                  <Paragraph className="booking-count-note">{item.note}</Paragraph>
                </div>
                <div className="booking-count-price-col">
                  <div className="booking-count-price">{formatMoney(item.price)}</div>
                </div>
                <div className="booking-stepper-wrap">
                  <button type="button" className="booking-stepper-btn" onClick={() => capNhatSoLuong(item.type, -1)}>
                    <MinusOutlined />
                  </button>
                  <div className="booking-stepper-val">{passengerCounts[item.type]}</div>
                  <button type="button" className="booking-stepper-btn" onClick={() => capNhatSoLuong(item.type, 1)}>
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="booking-actions-row">
            <Button size="large" className="booking-secondary-button" onClick={() => setCurrentStep('contact')}>
              Quay lại
            </Button>
            <Button type="primary" size="large" className="booking-primary-button" onClick={xuLyQuaBuocSoLuong}>
              Tiếp tục <RightOutlined />
            </Button>
          </div>
        </Card>
      )
    }

    if (currentStep === 'passengers') {
      return (
        <Card className="booking-card" variant="borderless">
          <Title className="booking-section-title">Thông tin hành khách</Title>
          <Paragraph className="booking-section-subtitle">Vui lòng nhập thông tin chính xác cho tất cả hành khách</Paragraph>

          <div className="booking-passenger-list">
            {passengers.map((item) => (
              <div key={item.id} className="booking-passenger-card">
                <Title level={3} className="booking-passenger-title">{item.nhan}</Title>
                <Row gutter={20}>
                  <Col xs={24} md={14}>
                    <label className="booking-field-label">Họ và tên *</label>
                    <Input
                      size="large"
                      placeholder="Nhập họ tên đầy đủ"
                      value={item.hoTen}
                      onChange={(event) => capNhatPassenger(item.id, 'hoTen', event.target.value)}
                      className="booking-input"
                    />
                  </Col>
                  <Col xs={24} md={10}>
                    <label className="booking-field-label">Ngày sinh</label>
                    <DatePicker
                      size="large"
                      format="DD/MM/YYYY"
                      value={item.ngaySinh ?? null}
                      onChange={(value) => capNhatPassenger(item.id, 'ngaySinh', value)}
                      className="booking-date-input"
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <label className="booking-field-label">Giới tính *</label>
                    <Select
                      size="large"
                      placeholder="Chọn"
                      value={item.gioiTinh}
                      options={genderOptions}
                      onChange={(value) => capNhatPassenger(item.id, 'gioiTinh', value)}
                      className="booking-select"
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <label className="booking-field-label">Số giấy tờ</label>
                    <Input
                      size="large"
                      placeholder="CCCD / Passport"
                      value={item.soGiayTo}
                      onChange={(event) => capNhatPassenger(item.id, 'soGiayTo', event.target.value)}
                      className="booking-input"
                    />
                  </Col>
                  <Col xs={24} md={8}>
                    <label className="booking-field-label">Quốc tịch</label>
                    <Input
                      size="large"
                      placeholder="Việt Nam"
                      value={item.quocTich}
                      onChange={(event) => capNhatPassenger(item.id, 'quocTich', event.target.value)}
                      className="booking-input"
                    />
                  </Col>
                </Row>
              </div>
            ))}
          </div>

          <div className="booking-actions-row">
            <Button size="large" className="booking-secondary-button" onClick={() => setCurrentStep('counts')}>
              Quay lại
            </Button>
            <Button type="primary" size="large" className="booking-primary-button" onClick={xacNhanThongTinHanhKhach}>
              Tiếp tục <RightOutlined />
            </Button>
          </div>
        </Card>
      )
    }

    return (
      <Card className="booking-card" variant="borderless">
        <Title className="booking-section-title">Xác nhận thông tin</Title>

        <div className="booking-voucher-row">
          <div className="booking-voucher-input-wrap">
            <label className="booking-field-label">Mã voucher (nếu có)</label>
            <Input
              size="large"
              placeholder="Nhập mã voucher"
              value={voucherCode}
              onChange={(event) => setVoucherCode(event.target.value)}
              className="booking-input"
            />
          </div>
          <Button size="large" className="booking-secondary-button booking-voucher-button">Áp dụng</Button>
        </div>

        <div className="booking-confirm-box">
          <Title level={3} className="booking-confirm-title">Thông tin liên hệ</Title>
          <div className="booking-confirm-grid">
            <span>Họ tên:</span>
            <strong>{contactInfo?.hoTenLienHe || 'Chưa nhập'}</strong>
            <span>Điện thoại:</span>
            <strong>{contactInfo?.soDienThoaiLienHe || 'Chưa nhập'}</strong>
            <span>Email:</span>
            <strong>{contactInfo?.emailLienHe || 'Chưa nhập'}</strong>
          </div>
        </div>

        <div className="booking-confirm-box">
          <Title level={3} className="booking-confirm-title">Số lượng khách</Title>
          <div className="booking-confirm-grid">
            <span>Người lớn:</span>
            <strong>{passengerCounts.nguoi_lon} người</strong>
            <span>Trẻ em:</span>
            <strong>{passengerCounts.tre_em} người</strong>
            <span>Em bé:</span>
            <strong>{passengerCounts.em_be} người</strong>
          </div>
        </div>

        <div className="booking-confirm-checkbox">
          <Checkbox checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)}>
            Tôi đồng ý với <a href="#">điều khoản và điều kiện</a> của công ty
          </Checkbox>
        </div>

        <div className="booking-note-wrap">
          <label className="booking-field-label">Ghi chú thêm</label>
          <TextArea rows={4} placeholder="Nhập ghi chú nếu có" value={ghiChu} onChange={(event) => setGhiChu(event.target.value)} />
        </div>

        <div className="booking-actions-row">
          <Button size="large" className="booking-secondary-button" onClick={() => setCurrentStep('passengers')}>
            Quay lại
          </Button>
          <Button type="primary" size="large" loading={submitting} className="booking-primary-button" onClick={handleSubmit}>
            Xác nhận đặt tour <RightOutlined />
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <div className="booking-page">
      <div className="booking-page-container">
        <div className="booking-page-title-wrap">
          <Title className="booking-page-title">Đặt tour</Title>
        </div>

        {successMessage ? <Alert type="success" showIcon message={successMessage} className="booking-alert" /> : null}
        {errorMessage ? <Alert type="error" showIcon message={errorMessage} className="booking-alert" /> : null}

        <Row gutter={[28, 28]} align="top">
          <Col xs={24} xl={16}>
            <Card className="booking-card booking-step-card" variant="borderless">
              <div className="booking-steps">
                {steps.map((step, index) => {
                  const isDone = index < stepsIndex
                  const isCurrent = step.key === currentStep

                  return (
                    <div key={step.key} className="booking-step-item-wrap">
                      <div className="booking-step-item">
                        <div className={`booking-step-icon ${isDone ? 'is-done' : isCurrent ? 'is-current' : ''}`}>
                          {isDone ? <CheckOutlined /> : step.icon}
                        </div>
                        <div className={`booking-step-label ${isCurrent ? 'is-current' : ''}`}>{step.label}</div>
                      </div>
                      {index < steps.length - 1 ? <div className={`booking-step-line ${isDone ? 'is-done' : ''}`} /> : null}
                    </div>
                  )
                })}
              </div>
            </Card>

            {renderStepContent()}
          </Col>

          <Col xs={24} xl={8}>
            <Card className="booking-card booking-summary-card" variant="borderless">
              <Space direction="vertical" size={20} className="booking-card-stack">
                <Title className="booking-summary-title">Thông tin đặt tour</Title>

                <div className="booking-summary-group">
                  <Text className="booking-summary-label">Tour</Text>
                  <div className="booking-summary-value booking-summary-value-large">{tour.tenTour}</div>
                </div>

                <div className="booking-summary-group">
                  <Text className="booking-summary-label">Mã tour</Text>
                  <div className="booking-summary-value">{tour.maTour}</div>
                </div>

                <div className="booking-summary-group">
                  <Text className="booking-summary-label">Lịch khởi hành</Text>
                  <div className="booking-summary-value">{formatDate(departure.ngayKhoiHanh)}</div>
                </div>

                <div className="booking-summary-divider" />

                <div className="booking-summary-line">
                  <span>Người lớn x {passengerCounts.nguoi_lon}</span>
                  <strong>{formatMoney(pricingSummary.nguoiLon * passengerCounts.nguoi_lon)}</strong>
                </div>
                <div className="booking-summary-line">
                  <span>Trẻ em x {passengerCounts.tre_em}</span>
                  <strong>{formatMoney(pricingSummary.treEm * passengerCounts.tre_em)}</strong>
                </div>
                <div className="booking-summary-line">
                  <span>Em bé x {passengerCounts.em_be}</span>
                  <strong>{formatMoney(pricingSummary.emBe * passengerCounts.em_be)}</strong>
                </div>
                <div className="booking-summary-line">
                  <span>Tạm tính</span>
                  <strong>{formatMoney(tongTamTinh)}</strong>
                </div>

                <div className="booking-summary-divider" />

                <div className="booking-total-row">
                  <span>Tổng tiền</span>
                  <strong>{formatMoney(tongTamTinh)}</strong>
                </div>

                <Button className="booking-summary-backlink" onClick={() => navigate(getTourChiTietPath(tour.id))}>
                  Quay lại chi tiết tour
                </Button>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
