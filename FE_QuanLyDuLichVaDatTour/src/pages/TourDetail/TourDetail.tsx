import './TourDetail.css'
import { Breadcrumb, Button, Card, Empty, Image, Select, Skeleton, Tabs, Tag, Typography } from 'antd'
import { Link, useNavigate, useParams } from 'react-router'
import { formatNgay } from '../../libs/helpers/formatNgay'
import { formatTien } from '../../libs/helpers/formatTien'
import { PATHS } from '../../paths'
import { useTourChiTietPage } from '../../services/tour/useTourChiTietPage'

const { Paragraph, Text, Title } = Typography

function formatTime(value: string | null) {
  if (!value) return ''
  return value.slice(0, 5)
}

export default function TourDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const tourId = Number(id)
  const isValidId = Number.isInteger(tourId) && tourId > 0

  const {
    detailQuery,
    itineraryQuery,
    departuresQuery,
    pricingQuery,
    selectedDeparture,
    setSelectedDeparture,
    gallery,
    heroImage,
    infoFacts,
    itineraryByDay,
  } = useTourChiTietPage(tourId, isValidId)

  if (!isValidId) {
    return <div className="tour-detail-page-state">Tour không hợp lệ.</div>
  }

  if (detailQuery.isLoading) {
    return (
      <div className="tour-detail-page">
        <div className="tour-detail-container">
          <Skeleton active paragraph={{ rows: 16 }} />
        </div>
      </div>
    )
  }

  if (detailQuery.isError || !detailQuery.data) {
    return <div className="tour-detail-page-state">Không thể tải chi tiết tour.</div>
  }

  const detail = detailQuery.data
  const departureOptions = (departuresQuery.data ?? []).map((item) => ({
    value: item.id,
    label: `${item.maDotTour} - ${formatNgay(item.ngayKhoiHanh)}`,
  }))

  const handleBooking = () => {
    if (!selectedDeparture) {
      return
    }

    const bookingPath = `${PATHS.booking}?tourId=${tourId}&departureId=${selectedDeparture.id}`
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
      navigate(`${PATHS.login}?redirect=${encodeURIComponent(bookingPath)}`, { state: { from: bookingPath } })
      return
    }

    navigate(bookingPath)
  }

  return (
    <div className="tour-detail-page">
      <div className="tour-detail-container">
        <Breadcrumb
          className="tour-detail-breadcrumb"
          items={[
            { title: <Link to={PATHS.home}>Trang chủ</Link> },
            { title: <Link to={PATHS.tour}>Tour</Link> },
            { title: detail.maTour },
          ]}
        />

        <div className="tour-detail-layout">
          <div className="tour-detail-main-column">
            <Card className="tour-detail-hero-card" variant="borderless">
              <div className="tour-detail-hero-media">
                {heroImage ? (
                  <Image src={heroImage} alt={detail.tenTour} className="tour-detail-hero-image" preview />
                ) : (
                  <div className="tour-detail-hero-placeholder">Chưa có ảnh tour</div>
                )}
                <Tag className="tour-detail-status-tag">{detail.trangThai}</Tag>
              </div>

              {gallery.length > 1 ? (
                <div className="tour-detail-gallery-strip">
                  {gallery.map((item) => (
                    <Image key={item.id} src={item.imageUrl} alt={item.alt} className="tour-detail-gallery-thumb" preview />
                  ))}
                </div>
              ) : null}
            </Card>

            <Card className="tour-detail-summary-card" variant="borderless">
              <Text className="tour-detail-code">{detail.maTour}</Text>
              <Title className="tour-detail-title">{detail.tenTour}</Title>

              <div className="tour-detail-facts-grid">
                {infoFacts.map((fact) => (
                  <div key={fact.key} className="tour-detail-fact-item">
                    <Text className="tour-detail-fact-label">{fact.label}</Text>
                    <Title level={4} className="tour-detail-fact-value">
                      {fact.value}
                    </Title>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="tour-detail-tabs-card" variant="borderless">
              <Tabs
                defaultActiveKey="tong-quan"
                items={[
                  {
                    key: 'tong-quan',
                    label: 'Tổng quan',
                    children: (
                      <div className="tour-detail-section-content">
                        {detail.moTaChiTiet ?? detail.moTaNgan ? (
                          <Paragraph className="tour-detail-overview-text">
                            {detail.moTaChiTiet ?? detail.moTaNgan}
                          </Paragraph>
                        ) : (
                          <Empty description="Chưa có thông tin" />
                        )}
                        {detail.diemDens.length > 0 ? (
                          <div className="tour-detail-destination-list">
                            {detail.diemDens
                              .slice()
                              .sort((a, b) => a.thuTu - b.thuTu)
                              .map((item) => (
                                <Tag key={item.id} className="tour-detail-destination-tag">
                                  {item.tenDiaDiem}
                                </Tag>
                              ))}
                          </div>
                        ) : null}
                      </div>
                    ),
                  },
                  {
                    key: 'lich-trinh',
                    label: 'Lịch trình',
                    children: itineraryQuery.isLoading ? (
                      <Skeleton active paragraph={{ rows: 8 }} />
                    ) : itineraryByDay.length === 0 ? (
                      <Empty description="Chưa có lịch trình" />
                    ) : (
                      <div className="tour-detail-itinerary-list">
                        {itineraryByDay.map((dayGroup) => (
                          <div key={dayGroup.day} className="tour-detail-day-block">
                            <div className="tour-detail-day-header">
                              <div className="tour-detail-day-badge">{dayGroup.day}</div>
                              <Title level={3} className="tour-detail-day-title">
                                Ngày {dayGroup.day}
                              </Title>
                            </div>
                            <div className="tour-detail-timeline-list">
                              {dayGroup.items.map((item) => (
                                <div key={item.id} className="tour-detail-timeline-item">
                                  <div className="tour-detail-timeline-time">
                                    {formatTime(item.gioBatDau)}
                                  </div>
                                  <div className="tour-detail-timeline-body">
                                    <Title level={4} className="tour-detail-timeline-title">
                                      {item.tieuDe ?? 'Hoạt động'}
                                    </Title>
                                    {item.noiDung ? (
                                      <Paragraph className="tour-detail-timeline-text">
                                        {item.noiDung}
                                      </Paragraph>
                                    ) : null}
                                    {item.tenDiaDiem ? <Text className="tour-detail-timeline-location">📍 {item.tenDiaDiem}</Text> : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    key: 'lich-khoi-hanh',
                    label: 'Lịch khởi hành',
                    children: departuresQuery.isLoading ? (
                      <Skeleton active paragraph={{ rows: 6 }} />
                    ) : (departuresQuery.data ?? []).length === 0 ? (
                      <Empty description="Chưa có lịch khởi hành" />
                    ) : (
                      <div className="tour-detail-departure-list">
                        {(departuresQuery.data ?? []).map((item) => (
                          <div key={item.id} className="tour-detail-departure-card">
                            <div className="tour-detail-departure-left">
                              <div className="tour-detail-departure-top-row">
                                <Tag className="tour-detail-departure-code">{item.maDotTour}</Tag>
                                <Tag className="tour-detail-departure-status">{item.trangThai}</Tag>
                              </div>
                              <div className="tour-detail-departure-grid">
                                <div>
                                  <Text className="tour-detail-departure-label">Ngày khởi hành</Text>
                                  <Title level={4} className="tour-detail-departure-value">{formatNgay(item.ngayKhoiHanh)}</Title>
                                </div>
                                <div>
                                  <Text className="tour-detail-departure-label">Ngày kết thúc</Text>
                                  <Title level={4} className="tour-detail-departure-value">{formatNgay(item.ngayKetThuc)}</Title>
                                </div>
                              </div>
                              <div>
                                <Text className="tour-detail-departure-label">Nơi tập trung</Text>
                                <Title level={4} className="tour-detail-departure-value">{item.noiTapTrung ?? detail.tenDiaDiemKhoiHanh}</Title>
                              </div>
                            </div>
                            <div className="tour-detail-departure-right">
                              <Text className="tour-detail-departure-price-label">Giá từ</Text>
                              <Title className="tour-detail-departure-price">{formatTien(pricingQuery.data?.giaNguoiLonNgayThuong ?? detail.giaNguoiLonMacDinh)}</Title>
                              <Button
                                type={selectedDeparture?.id === item.id ? 'primary' : 'default'}
                                className="tour-detail-departure-button"
                                onClick={() => setSelectedDeparture(item)}
                              >
                                {selectedDeparture?.id === item.id ? 'Đã chọn' : 'Chọn lịch này'}
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    key: 'gia-tour',
                    label: 'Giá tour',
                    children: (
                      <div className="tour-detail-price-grid">
                        <div className="tour-detail-price-card price-card-weekday">
                          <Title level={3}>Giá ngày thường</Title>
                          <div className="tour-detail-price-item"><span>Người lớn</span><strong>{formatTien(pricingQuery.data?.giaNguoiLonNgayThuong ?? detail.giaNguoiLonMacDinh)}</strong></div>
                          <div className="tour-detail-price-item"><span>Trẻ em</span><strong>{formatTien(pricingQuery.data?.giaTreEmNgayThuong)}</strong></div>
                          <div className="tour-detail-price-item"><span>Em bé</span><strong>{formatTien(pricingQuery.data?.giaEmBeNgayThuong)}</strong></div>
                        </div>
                        <div className="tour-detail-price-card price-card-weekend">
                          <Title level={3}>Giá cuối tuần</Title>
                          <div className="tour-detail-price-item"><span>Người lớn</span><strong>{formatTien(pricingQuery.data?.giaNguoiLonCuoiTuan ?? detail.giaNguoiLonMacDinh)}</strong></div>
                          <div className="tour-detail-price-item"><span>Trẻ em</span><strong>{formatTien(pricingQuery.data?.giaTreEmCuoiTuan)}</strong></div>
                          <div className="tour-detail-price-item"><span>Em bé</span><strong>{formatTien(pricingQuery.data?.giaEmBeCuoiTuan)}</strong></div>
                        </div>
                      </div>
                    ),
                  },
                  {
                    key: 'dieu-kien',
                    label: 'Điều kiện tour',
                    children: (
                      <div className="tour-detail-section-content">
                        {detail.dieuKienTour ? (
                          <Paragraph className="tour-detail-overview-text">
                            {detail.dieuKienTour}
                          </Paragraph>
                        ) : (
                          <Empty description="Chưa có thông tin" />
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </Card>
          </div>

          <div className="tour-detail-sidebar">
            <Card className="tour-detail-sidebar-card" variant="borderless">
              <Text className="tour-detail-sidebar-price-label">Giá từ</Text>
              <Title className="tour-detail-sidebar-price">{formatTien(pricingQuery.data?.giaNguoiLonNgayThuong ?? detail.giaNguoiLonMacDinh)}</Title>
              <Text className="tour-detail-sidebar-price-note">Người lớn / Ngày thường</Text>

              <div className="tour-detail-sidebar-section">
                <Title level={4}>Chọn lịch khởi hành</Title>
                <Select
                  value={selectedDeparture?.id}
                  options={departureOptions}
                  onChange={(value) => {
                    const found = (departuresQuery.data ?? []).find((item) => item.id === value)
                    setSelectedDeparture(found ?? null)
                  }}
                  placeholder="Chọn ngày khởi hành..."
                  className="tour-detail-sidebar-select"
                />
              </div>

              <div className="tour-detail-sidebar-actions">
                <Button type="primary" className="tour-detail-primary-button" onClick={handleBooking} disabled={!selectedDeparture}>Đặt tour ngay</Button>
                <Button className="tour-detail-secondary-button">Liên hệ tư vấn</Button>
              </div>

            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
