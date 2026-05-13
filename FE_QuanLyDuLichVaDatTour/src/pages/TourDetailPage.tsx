import './TourDetailPage.css'
import { Breadcrumb, Button, Card, Empty, Image, Rate, Select, Skeleton, Tabs, Tag, Typography, Divider } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router'
import { formatDate } from '../utils/formatDate'
import { formatMoney } from '../utils/formatMoney'
import { PATHS } from '../constants/paths'
import { useTourChiTietPage } from '../services/tour/useTourChiTietPage'
import { useAuthStore } from '../store/authStore'
import { layDanhGiaDaDuyetTheoTour } from '../services/review/review'

const { Paragraph, Text, Title } = Typography

function formatTime(value: string | null) {
  if (!value) return ''
  return value.slice(0, 5)
}

function resolveConfiguredPrice(primary?: number | null, fallback?: number | null, defaultPrice?: number | null) {
  if (primary != null && primary > 0) return primary
  if (fallback != null && fallback > 0) return fallback
  return defaultPrice ?? 0
}

function isWeekendNow() {
  const day = new Date().getDay()
  return day === 0 || day === 6
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

  const reviewsQuery = useQuery({
    queryKey: ['tour-reviews', tourId],
    queryFn: () => layDanhGiaDaDuyetTheoTour(tourId),
    enabled: isValidId,
  })

  const reviewSummary = detailQuery.data

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
  const isWeekend = isWeekendNow()
  const selectedAdultPrice = isWeekend
    ? resolveConfiguredPrice(pricingQuery.data?.giaNguoiLonCuoiTuan, pricingQuery.data?.giaNguoiLonNgayThuong, detail.giaNguoiLonMacDinh)
    : resolveConfiguredPrice(pricingQuery.data?.giaNguoiLonNgayThuong, pricingQuery.data?.giaNguoiLonCuoiTuan, detail.giaNguoiLonMacDinh)
  const selectedPriceNote = isWeekend ? 'Người lớn / Cuối tuần' : 'Người lớn / Ngày thường'
  const selectedDeparturePrice = selectedAdultPrice
  const selectedDepartureUnavailable = !selectedDeparture || selectedDeparture.trangThai === 'het_cho' || selectedDeparture.soChoConLai <= 0
  const departureOptions = (departuresQuery.data ?? []).map((item) => ({
    value: item.id,
    label: `${item.maDotTour} - ${formatDate(item.ngayKhoiHanh)} - còn ${item.soChoConLai} chỗ`,
    disabled: item.trangThai === 'het_cho' || item.soChoConLai <= 0,
  }))

  const handleBooking = () => {
    if (selectedDepartureUnavailable) {
      return
    }

    const bookingPath = `${PATHS.booking}?tourId=${tourId}&departureId=${selectedDeparture.id}`
    const accessToken = useAuthStore.getState().accessToken

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
              <div className="tour-detail-header-top">
                <Text className="tour-detail-code">{detail.maTour}</Text>
                <div className="tour-detail-rating-inline">
                  <Rate disabled allowHalf value={reviewSummary?.averageRating || 0} className="inline-stars" />
                  <Text strong className="inline-avg">{(reviewSummary?.averageRating || 0).toFixed(1)}</Text>
                  <Text className="inline-count">({reviewSummary?.totalReviews || 0} đánh giá)</Text>
                </div>
              </div>
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
                                <Tag className="tour-detail-departure-status">{item.trangThai === 'het_cho' || item.soChoConLai <= 0 ? 'het_cho' : item.trangThai}</Tag>
                              </div>
                              <div className="tour-detail-departure-grid">
                                <div>
                                  <Text className="tour-detail-departure-label">Ngày khởi hành</Text>
                                  <Title level={4} className="tour-detail-departure-value">{formatDate(item.ngayKhoiHanh)}</Title>
                                </div>
                                <div>
                                  <Text className="tour-detail-departure-label">Ngày kết thúc</Text>
                                  <Title level={4} className="tour-detail-departure-value">{formatDate(item.ngayKetThuc)}</Title>
                                </div>
                              </div>
                              <div>
                                <Text className="tour-detail-departure-label">Nơi tập trung</Text>
                                <Title level={4} className="tour-detail-departure-value">{item.noiTapTrung ?? detail.tenDiaDiemKhoiHanh}</Title>
                              </div>
                              <div>
                                <Text className="tour-detail-departure-label">Số chỗ</Text>
                                <Title level={4} className="tour-detail-departure-value">Còn {item.soChoConLai} chỗ</Title>
                                <Text className="tour-detail-departure-label">Đã đặt {item.soChoDaDat}/{item.soChoToiDa} chỗ</Text>
                              </div>
                            </div>
                            <div className="tour-detail-departure-right">
                              <Text className="tour-detail-departure-price-label">Giá từ</Text>
                              <Title className="tour-detail-departure-price">{formatMoney(selectedDeparturePrice)}</Title>
                              <Button
                                type={selectedDeparture?.id === item.id ? 'primary' : 'default'}
                                className="tour-detail-departure-button"
                                disabled={item.trangThai === 'het_cho' || item.soChoConLai <= 0}
                                onClick={() => setSelectedDeparture(item)}
                              >
                                {item.trangThai === 'het_cho' || item.soChoConLai <= 0 ? 'Hết chỗ' : selectedDeparture?.id === item.id ? 'Đã chọn' : 'Chọn lịch này'}
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
                          <div className="tour-detail-price-item"><span>Người lớn</span><strong>{formatMoney(pricingQuery.data?.giaNguoiLonNgayThuong ?? detail.giaNguoiLonMacDinh)}</strong></div>
                          <div className="tour-detail-price-item"><span>Trẻ em</span><strong>{formatMoney(pricingQuery.data?.giaTreEmNgayThuong)}</strong></div>
                          <div className="tour-detail-price-item"><span>Em bé</span><strong>{formatMoney(pricingQuery.data?.giaEmBeNgayThuong)}</strong></div>
                        </div>
                        <div className="tour-detail-price-card price-card-weekend">
                          <Title level={3}>Giá cuối tuần</Title>
                          <div className="tour-detail-price-item"><span>Người lớn</span><strong>{formatMoney(pricingQuery.data?.giaNguoiLonCuoiTuan ?? detail.giaNguoiLonMacDinh)}</strong></div>
                          <div className="tour-detail-price-item"><span>Trẻ em</span><strong>{formatMoney(pricingQuery.data?.giaTreEmCuoiTuan)}</strong></div>
                          <div className="tour-detail-price-item"><span>Em bé</span><strong>{formatMoney(pricingQuery.data?.giaEmBeCuoiTuan)}</strong></div>
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
                  {
                    key: 'danh-gia',
                    label: 'Đánh giá',
                    children: (
                      <div className="tour-detail-reviews-container">
                        <div className="tour-detail-reviews-summary">
                          <div className="review-summary-stats">
                            <Title level={1} className="review-summary-avg">
                              {(reviewSummary?.averageRating || 0).toFixed(1)}
                            </Title>
                            <div className="review-summary-info">
                              <Rate disabled allowHalf value={reviewSummary?.averageRating || 0} className="review-summary-stars" />
                              <Text className="review-summary-count">{reviewSummary?.totalReviews || 0} đánh giá</Text>
                            </div>
                          </div>
                        </div>

                        <Divider className="review-section-divider" />

                        {reviewsQuery.isLoading ? (
                          <Skeleton active paragraph={{ rows: 6 }} />
                        ) : (reviewsQuery.data ?? []).length === 0 ? (
                          <Empty description="Chưa có đánh giá nào cho tour này" />
                        ) : (
                          <div className="tour-detail-review-list">
                            {(reviewsQuery.data ?? []).map((review) => (
                              <div key={review.id} className="tour-detail-review-item">
                                <div className="review-item-header">
                                  <Title level={4} className="review-item-author">{review.hoTenKhachHang}</Title>
                                  <div className="review-item-meta">
                                    <Rate disabled value={review.soSao} className="review-item-stars" />
                                    <Text className="review-item-date">{formatDate(review.ngayDanhGia)}</Text>
                                  </div>
                                </div>
                                <Paragraph className="review-item-content">
                                  {review.noiDung}
                                </Paragraph>
                                {review.phanHoiAdmin && (
                                  <div className="review-item-reply">
                                    <Text strong>Phản hồi từ Travel Viet:</Text>
                                    <Paragraph className="reply-text">{review.phanHoiAdmin}</Paragraph>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
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
              <Title className="tour-detail-sidebar-price">{formatMoney(selectedAdultPrice)}</Title>
              <Text className="tour-detail-sidebar-price-note">{selectedPriceNote}</Text>

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
                <Button type="primary" className="tour-detail-primary-button" onClick={handleBooking} disabled={selectedDepartureUnavailable}>Đặt tour ngay</Button>
                <Button className="tour-detail-secondary-button">Liên hệ tư vấn</Button>
              </div>

            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
