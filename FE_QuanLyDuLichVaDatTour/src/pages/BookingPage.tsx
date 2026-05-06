import './BookingPage.css'
import { Alert, Button, Card, Checkbox, Col, DatePicker, Form, Input, Row, Select, Skeleton, Space, Typography, Tag, Divider } from 'antd'
import { CheckOutlined, GiftOutlined, MinusOutlined, PlusOutlined, RightOutlined, TeamOutlined, UserOutlined, EnvironmentOutlined, IdcardOutlined, BankOutlined, CalendarOutlined } from '@ant-design/icons'
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
import { BOOKING_DETAIL_PATH } from '../constants/paths'

const { Paragraph, Text, Title } = Typography
const { TextArea } = Input

type StepKey = 'contact' | 'counts' | 'passengers' | 'confirm'
type PassengerType = 'nguoi_lon' | 'tre_em' | 'em_be'

interface BookingContactValues {
  hoTenLienHe: string
  emailLienHe: string
  soDienThoaiLienHe: string
  tinhThanh?: string
  quanHuyen?: string
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
  { key: 'contact' as const, label: 'Thông tin liên hệ', icon: <IdcardOutlined /> },
  { key: 'counts' as const, label: 'Số lượng khách', icon: <TeamOutlined /> },
  { key: 'passengers' as const, label: 'Thông tin hành khách', icon: <UserOutlined /> },
  { key: 'confirm' as const, label: 'Xác nhận & Thanh toán', icon: <CheckOutlined /> },
]

const genderOptions = [
  { value: 'nam', label: 'Nam' },
  { value: 'nu', label: 'Nữ' },
  { value: 'khac', label: 'Khác' },
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

  const [selectedProvinceCode, setSelectedProvinceCode] = useState<string | null>(null)

  const bookingQuery = useQuery({
    queryKey: ['booking-page', tourId, departureId],
    queryFn: () => layDuLieuDatTour(tourId, departureId),
    enabled: isValidParams,
  })

  // Fetch provinces data for the address selection
  const provincesQuery = useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      const res = await fetch('https://provinces.open-api.vn/api/?depth=2')
      if (!res.ok) throw new Error('Network response was not ok')
      return res.json()
    },
    staleTime: Infinity,
  })

  const pricingSummary = useMemo(() => {
    if (!bookingQuery.data) return null
    return {
      nguoiLon: bookingQuery.data.pricing.giaNguoiLonNgayThuong ?? bookingQuery.data.tour.giaNguoiLonMacDinh ?? 0,
      treEm: bookingQuery.data.pricing.giaTreEmNgayThuong ?? 0,
      emBe: bookingQuery.data.pricing.giaEmBeNgayThuong ?? 0,
    }
  }, [bookingQuery.data])

  const totalGuests = passengerCounts.nguoi_lon + passengerCounts.tre_em + passengerCounts.em_be

  const tongTamTinh = useMemo(() => {
    if (!pricingSummary) return 0
    return pricingSummary.nguoiLon * passengerCounts.nguoi_lon + pricingSummary.treEm * passengerCounts.tre_em + pricingSummary.emBe * passengerCounts.em_be
  }, [pricingSummary, passengerCounts])

  const stepsIndex = steps.findIndex((item) => item.key === currentStep)

  if (!isValidParams) {
    return (
      <div className="booking-page-state">
        <Alert type="warning" showIcon title="Thiếu thông tin đặt tour" description="Vui lòng quay lại trang chi tiết tour và chọn lại lịch khởi hành." />
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
        <Alert type="error" showIcon title="Không thể tải trang đặt tour" description="Lịch khởi hành không còn hợp lệ hoặc dữ liệu tour đang tạm thời gián đoạn." />
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
      
      // Construct address string from Province and District
      let diaChi = values.diaChiLienHe || ''
      if (provincesQuery.data) {
        const province = provincesQuery.data.find((p: any) => p.code === values.tinhThanh)
        const district = province?.districts.find((d: any) => d.code === values.quanHuyen)
        
        const addressParts = []
        if (district) addressParts.push(district.name)
        if (province) addressParts.push(province.name)
        diaChi = addressParts.join(', ')
      }

      setContactInfo({
        ...values,
        diaChiLienHe: diaChi || undefined
      })
      setErrorMessage(null)
      setCurrentStep('counts')
    } catch {
      setErrorMessage('Vui lòng nhập đầy đủ thông tin liên hệ bắt buộc.')
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

      navigate(BOOKING_DETAIL_PATH(response.id))
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Đặt tour thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStepContent = () => {
    if (currentStep === 'contact') {
      return (
        <div className="booking-panel-fade-in">
          <Card className="booking-card" variant="borderless">
            <div className="booking-section-header">
              <div className="booking-section-icon"><IdcardOutlined /></div>
              <Title className="booking-section-title">Thông tin liên hệ</Title>
            </div>
            
            <Form
              form={contactForm}
              layout="vertical"
              className="booking-form"
              autoComplete="off"
              initialValues={{
                hoTenLienHe: currentUser?.hoTen ?? '',
                emailLienHe: currentUser?.email ?? '',
                soDienThoaiLienHe: '',
                tinhThanh: undefined,
                quanHuyen: undefined,
              }}
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Họ và tên người liên hệ" name="hoTenLienHe" rules={[{ required: true, message: 'Vui lòng nhập họ tên đầy đủ' }]}>
                    <Input size="large" placeholder="Nhập họ tên đầy đủ" className="booking-input" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Số điện thoại"
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
                <Col xs={24} md={24}>
                  <Form.Item
                    label="Email"
                    name="emailLienHe"
                    rules={[
                      { required: true, message: 'Vui lòng nhập email' },
                      { type: 'email', message: 'Email không hợp lệ' },
                    ]}
                  >
                    <Input size="large" placeholder="Nhập email để nhận xác nhận" className="booking-input" />
                  </Form.Item>
                </Col>
                
                <Col xs={24} md={12}>
                  <Form.Item label="Tỉnh/Thành phố" name="tinhThanh" rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố' }]}>
                    <Select
                      size="large"
                      placeholder="Chọn Tỉnh/Thành phố"
                      options={provincesQuery.data?.map((p: any) => ({ value: p.code, label: p.name })) || []}
                      onChange={(value) => {
                         contactForm.setFieldValue('quanHuyen', undefined)
                         setSelectedProvinceCode(value)
                      }}
                      className="booking-select"
                      showSearch
                      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                      loading={provincesQuery.isLoading}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Quận/Huyện" name="quanHuyen">
                    <Select
                      size="large"
                      placeholder="Chọn Quận/Huyện"
                      disabled={!selectedProvinceCode}
                      options={
                        provincesQuery.data
                          ?.find((p: any) => p.code === selectedProvinceCode)
                          ?.districts.map((d: any) => ({ value: d.code, label: d.name })) || []
                      }
                      className="booking-select"
                      showSearch
                      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    />
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
        </div>
      )
    }

    if (currentStep === 'counts') {
      return (
        <div className="booking-panel-fade-in">
          <Card className="booking-card" variant="borderless">
            <div className="booking-section-header">
              <div className="booking-section-icon"><TeamOutlined /></div>
              <Title className="booking-section-title">Chọn số lượng khách</Title>
            </div>
            
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
                    <button type="button" className="booking-stepper-btn" onClick={() => capNhatSoLuong(item.type, -1)} disabled={item.type === 'nguoi_lon' && passengerCounts.nguoi_lon <= 1}>
                      <MinusOutlined />
                    </button>
                    <div className="booking-stepper-val">{passengerCounts[item.type]}</div>
                    <button type="button" className="booking-stepper-btn" onClick={() => capNhatSoLuong(item.type, 1)}>
                      <PlusOutlined />
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
        </div>
      )
    }

    if (currentStep === 'passengers') {
      return (
        <div className="booking-panel-fade-in">
          <Card className="booking-card" variant="borderless">
            <div className="booking-section-header">
              <div className="booking-section-icon"><UserOutlined /></div>
              <div>
                <Title className="booking-section-title">Thông tin hành khách</Title>
                <Paragraph className="booking-section-subtitle">Vui lòng điền đúng thông tin như trên giấy tờ tùy thân để đảm bảo quyền lợi bảo hiểm và các thủ tục chuyến đi.</Paragraph>
              </div>
            </div>

            <div className="booking-passenger-list">
              {passengers.map((item) => (
                <div key={item.id} className="booking-passenger-card">
                  <div className="booking-passenger-header">
                    <Title level={4} className="booking-passenger-title">{item.nhan}</Title>
                  </div>
                  
                  <div className="booking-passenger-form-grid">
                    <div className="booking-field-group booking-field-span-2">
                      <label className="booking-field-label">Họ và tên <span className="auth-required">*</span></label>
                      <Input
                        size="large"
                        placeholder="VD: NGUYỄN VĂN A"
                        value={item.hoTen}
                        onChange={(event) => capNhatPassenger(item.id, 'hoTen', event.target.value.toUpperCase())}
                        className="booking-input"
                      />
                    </div>
                    <div className="booking-field-group">
                      <label className="booking-field-label">Ngày sinh</label>
                      <DatePicker
                        size="large"
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày sinh"
                        value={item.ngaySinh ?? null}
                        onChange={(value) => capNhatPassenger(item.id, 'ngaySinh', value)}
                        className="booking-date-input"
                      />
                    </div>
                    <div className="booking-field-group">
                      <label className="booking-field-label">Giới tính <span className="auth-required">*</span></label>
                      <Select
                        size="large"
                        placeholder="Chọn"
                        value={item.gioiTinh}
                        options={genderOptions}
                        onChange={(value) => capNhatPassenger(item.id, 'gioiTinh', value)}
                        className="booking-select"
                      />
                    </div>
                    <div className="booking-field-group">
                      <label className="booking-field-label">Số CMND/CCCD/Passport</label>
                      <Input
                        size="large"
                        placeholder="Nhập số giấy tờ"
                        value={item.soGiayTo}
                        onChange={(event) => capNhatPassenger(item.id, 'soGiayTo', event.target.value)}
                        className="booking-input"
                      />
                    </div>
                    <div className="booking-field-group">
                      <label className="booking-field-label">Quốc tịch</label>
                      <Input
                        size="large"
                        placeholder="VD: Việt Nam"
                        value={item.quocTich}
                        onChange={(event) => capNhatPassenger(item.id, 'quocTich', event.target.value)}
                        className="booking-input"
                      />
                    </div>
                  </div>
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
        </div>
      )
    }

    return (
      <div className="booking-panel-fade-in">
        <Card className="booking-card" variant="borderless">
          <div className="booking-section-header">
            <div className="booking-section-icon"><BankOutlined /></div>
            <Title className="booking-section-title">Thanh toán & Xác nhận</Title>
          </div>

          <div className="booking-voucher-row">
            <div className="booking-voucher-input-wrap">
              <label className="booking-field-label">Mã giảm giá / Voucher</label>
              <Input
                size="large"
                placeholder="Nhập mã voucher (nếu có)"
                value={voucherCode}
                onChange={(event) => setVoucherCode(event.target.value)}
                className="booking-input"
                prefix={<GiftOutlined style={{ color: '#94a3b8' }} />}
              />
            </div>
            <Button size="large" className="booking-secondary-button booking-voucher-button">Áp dụng ngay</Button>
          </div>

          <div className="booking-confirm-box">
            <Title level={4} className="booking-confirm-title">Xác nhận thông tin người đặt</Title>
            <div className="booking-confirm-grid">
              <span>Họ tên:</span>
              <strong>{contactInfo?.hoTenLienHe || 'Chưa nhập'}</strong>
              <span>Điện thoại:</span>
              <strong>{contactInfo?.soDienThoaiLienHe || 'Chưa nhập'}</strong>
              <span>Email:</span>
              <strong>{contactInfo?.emailLienHe || 'Chưa nhập'}</strong>
              <span>Địa chỉ:</span>
              <strong>{contactInfo?.diaChiLienHe || 'Chưa nhập'}</strong>
            </div>
          </div>

          <div className="booking-note-wrap">
            <label className="booking-field-label">Ghi chú cho công ty du lịch</label>
            <TextArea rows={3} placeholder="VD: Khách ăn chay, có người lớn tuổi..." value={ghiChu} onChange={(event) => setGhiChu(event.target.value)} className="booking-input" />
          </div>

          <div className="booking-confirm-checkbox">
            <Checkbox checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)}>
              Tôi đã đọc và đồng ý với <a href="#">Điều khoản sử dụng</a> và <a href="#">Chính sách hoàn hủy</a> của Travel Viet.
            </Checkbox>
          </div>

          <div className="booking-actions-row">
            <Button size="large" className="booking-secondary-button" onClick={() => setCurrentStep('passengers')}>
              Quay lại
            </Button>
            <Button type="primary" size="large" loading={submitting} className="booking-primary-button booking-primary-button-lg" onClick={handleSubmit}>
              Hoàn tất đặt tour <CheckOutlined />
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="booking-page">
      <div className="booking-page-container">
        <div className="booking-page-header">
          <Title className="booking-page-main-title">Hoàn tất thủ tục đặt tour</Title>
        </div>

        {successMessage ? <Alert type="success" showIcon title={successMessage} className="booking-alert" /> : null}
        {errorMessage ? <Alert type="error" showIcon title={errorMessage} className="booking-alert" /> : null}

        <Row gutter={[32, 32]} align="top">
          <Col xs={24} xl={16}>
            <div className="booking-steps-wrapper">
              <div className="booking-steps-container">
                {steps.map((step, index) => {
                  const isDone = index < stepsIndex
                  const isCurrent = step.key === currentStep

                  return (
                    <div key={step.key} className={`booking-step-item ${isDone ? 'is-done' : isCurrent ? 'is-current' : ''}`}>
                      <div className="booking-step-icon-wrapper">
                        <div className="booking-step-icon">
                          {isDone ? <CheckOutlined /> : step.icon}
                        </div>
                      </div>
                      <div className="booking-step-label">{step.label}</div>
                      {index < steps.length - 1 && <div className="booking-step-connector"></div>}
                    </div>
                  )
                })}
              </div>
            </div>

            {renderStepContent()}
          </Col>

          <Col xs={24} xl={8}>
            <Card className="booking-summary-card" variant="borderless">
              <div className="booking-summary-header">
                <Title level={4} className="booking-summary-title">Thông tin tour</Title>
              </div>
              
              <div className="booking-summary-body">
                <div className="booking-summary-image-wrap">
                  <img 
                    src={tour.anhTours?.find(img => img.isAvatar)?.linkAnh || tour.anhTours?.[0]?.linkAnh || 'https://placehold.co/600x400?text=Travel+Viet'} 
                    alt={tour.tenTour} 
                    className="booking-summary-image" 
                  />
                </div>

                <div className="booking-summary-tour-info">
                  <Title level={4} className="booking-summary-tour-name">
                    {tour.tenTour}
                  </Title>
                  <Tag color="blue" className="booking-summary-tour-code">{tour.maTour}</Tag>
                </div>

                <Divider className="booking-summary-divider-subtle" />

                <div className="booking-summary-meta">
                  <div className="summary-meta-item">
                    <CalendarOutlined className="summary-meta-icon" />
                    <div className="summary-meta-content">
                      <Text type="secondary" className="summary-meta-label">Khởi hành</Text>
                      <Text className="summary-meta-value">{formatDate(departure.ngayKhoiHanh)}</Text>
                    </div>
                  </div>
                  <div className="summary-meta-item">
                    <CalendarOutlined className="summary-meta-icon" />
                    <div className="summary-meta-content">
                      <Text type="secondary" className="summary-meta-label">Kết thúc</Text>
                      <Text className="summary-meta-value">{formatDate(departure.ngayKetThuc)}</Text>
                    </div>
                  </div>
                  <div className="summary-meta-item">
                    <EnvironmentOutlined className="summary-meta-icon" />
                    <div className="summary-meta-content">
                      <Text type="secondary" className="summary-meta-label">Điểm tập trung</Text>
                      <Text className="summary-meta-value">{departure.noiTapTrung || tour.tenDiaDiemKhoiHanh}</Text>
                    </div>
                  </div>
                </div>

                <Divider className="booking-summary-divider-subtle" />

                <div className="booking-summary-pricing-section">
                  <Title level={5} className="pricing-title">Chi tiết giá</Title>
                  
                  <div className="pricing-rows">
                    {passengerCounts.nguoi_lon > 0 && (
                      <div className="pricing-row">
                        <Text type="secondary">{passengerCounts.nguoi_lon} người lớn</Text>
                        <Text strong>{formatMoney(pricingSummary.nguoiLon * passengerCounts.nguoi_lon)}</Text>
                      </div>
                    )}
                    {passengerCounts.tre_em > 0 && (
                      <div className="pricing-row">
                        <Text type="secondary">{passengerCounts.tre_em} trẻ em</Text>
                        <Text strong>{formatMoney(pricingSummary.treEm * passengerCounts.tre_em)}</Text>
                      </div>
                    )}
                    {passengerCounts.em_be > 0 && (
                      <div className="pricing-row">
                        <Text type="secondary">{passengerCounts.em_be} em bé</Text>
                        <Text strong>{formatMoney(pricingSummary.emBe * passengerCounts.em_be)}</Text>
                      </div>
                    )}
                    
                    <Divider className="pricing-inner-divider" />
                    
                    <div className="pricing-row subtotal-row">
                      <Text>Tạm tính</Text>
                      <Text strong>{formatMoney(tongTamTinh)}</Text>
                    </div>
                  </div>

                  <div className="pricing-total-box">
                    <Title level={3} className="total-label">Tổng cộng</Title>
                    <Title level={2} className="total-amount">{formatMoney(tongTamTinh)}</Title>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}
