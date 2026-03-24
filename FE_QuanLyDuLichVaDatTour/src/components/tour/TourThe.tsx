import { Button, Card, Rate, Typography } from 'antd'
import type { FeaturedTourApiItem } from '../../shared/home'
import { formatTien } from '../../utils/formatTien'

const { Paragraph, Text, Title } = Typography

interface TourTheProps {
  tour: FeaturedTourApiItem
  imageIndex: number
  viewMode: 'grid' | 'list'
}

const tourImages = [
  'linear-gradient(135deg, rgba(11, 90, 160, 0.18), rgba(11, 90, 160, 0.05)), url(https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80)',
  'linear-gradient(135deg, rgba(22, 163, 74, 0.18), rgba(22, 163, 74, 0.05)), url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80)',
  'linear-gradient(135deg, rgba(2, 132, 199, 0.18), rgba(2, 132, 199, 0.05)), url(https://images.unsplash.com/photo-1468413253725-0d5181091126?auto=format&fit=crop&w=1200&q=80)',
  'linear-gradient(135deg, rgba(234, 88, 12, 0.18), rgba(234, 88, 12, 0.05)), url(https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80)',
]

export function TourThe({ tour, imageIndex, viewMode }: TourTheProps) {
  const backgroundImage = tourImages[imageIndex % tourImages.length]
  const rating = 4.5 + ((tour.id % 5) * 0.1)
  const reviewCount = 120 + tour.id * 11
  const originalPrice = tour.giaNguoiLonMacDinh ? Math.round(tour.giaNguoiLonMacDinh * 1.18) : null
  const duration = `${tour.soNgay}N${tour.soDem}Đ`

  return (
    <Card className={`tour-card ${viewMode === 'list' ? 'tour-card-list' : ''}`} variant="borderless">
      <div className="tour-card-cover" style={{ backgroundImage }}>
        <span className="tour-card-status">Đang mở bán</span>
        <button type="button" className="tour-card-favorite" aria-label="Yêu thích tour">
          ♡
        </button>
        <span className="tour-card-code">{tour.maTour}</span>
      </div>

      <div className="tour-card-body">
        <Title level={3} className="tour-card-title">
          {tour.tenTour}
        </Title>

        <div className="tour-card-meta-list">
          <Text className="tour-card-meta">📍 Từ {tour.tenDiaDiemKhoiHanh}</Text>
          <Text className="tour-card-meta">📅 {duration} • {tour.phuongTien ?? 'Đang cập nhật'}</Text>
          <Text className="tour-card-meta tour-card-rating">
            <Rate disabled allowHalf value={rating} className="tour-card-stars" />
            <span>{rating.toFixed(1)} ({reviewCount} đánh giá)</span>
          </Text>
        </div>

        <Paragraph className="tour-card-description">
          {tour.moTaNgan ?? 'Hành trình du lịch hấp dẫn với lịch trình rõ ràng, phù hợp cho kỳ nghỉ sắp tới của bạn.'}
        </Paragraph>

        <div className="tour-card-footer">
          <div>
            <Text className="tour-card-price-label">Giá từ</Text>
            <div className="tour-card-price-row">
              <Title level={2} className="tour-card-price-current">
                {formatTien(tour.giaNguoiLonMacDinh)}
              </Title>
              {originalPrice ? <Text delete className="tour-card-price-old">{formatTien(originalPrice)}</Text> : null}
            </div>
            <Text className="tour-card-price-note">Ngày thường/người</Text>
          </div>

          <Button type="primary" className="tour-card-button">
            Xem chi tiết
          </Button>
        </div>
      </div>
    </Card>
  )
}
