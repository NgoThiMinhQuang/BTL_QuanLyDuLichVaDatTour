import { Button, Card, Typography } from 'antd'
import bannerImage from '../../assets/Banner.jpg'
import { resolveApiAssetUrl } from '../../constant/api'
import type { FeaturedTourApiItem } from '../../libs/types/tour'
import { formatTien } from '../../libs/helpers/formatTien'

const { Paragraph, Text, Title } = Typography

interface TourTheProps {
  tour: FeaturedTourApiItem
  imageIndex: number
  viewMode: 'grid' | 'list'
}

const tourGradients = [
  'linear-gradient(135deg, rgba(11, 90, 160, 0.32), rgba(11, 90, 160, 0.08))',
  'linear-gradient(135deg, rgba(22, 163, 74, 0.28), rgba(22, 163, 74, 0.08))',
  'linear-gradient(135deg, rgba(2, 132, 199, 0.28), rgba(2, 132, 199, 0.08))',
  'linear-gradient(135deg, rgba(234, 88, 12, 0.26), rgba(234, 88, 12, 0.08))',
]

export function TourThe({ tour, imageIndex, viewMode }: TourTheProps) {
  const coverImage = [...tour.anhTours]
    .sort((a, b) => Number(b.isAvatar) - Number(a.isAvatar) || a.thuTu - b.thuTu)
    .at(0)?.linkAnh

  const normalizedCoverImage = resolveApiAssetUrl(coverImage) ?? bannerImage

  const backgroundImage = `${tourGradients[imageIndex % tourGradients.length]}, url(${normalizedCoverImage})`
  const duration = `${tour.soNgay}N${tour.soDem}Đ`
  const statusLabel = tour.trangThai?.trim() || 'Đang cập nhật'

  return (
    <Card className={`tour-card ${viewMode === 'list' ? 'tour-card-list' : ''}`} variant="borderless">
      <div className="tour-card-cover" style={{ backgroundImage }}>
        <span className="tour-card-status">{statusLabel}</span>
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
          <Text className="tour-card-meta">🏷️ {tour.tenLoaiTour}</Text>
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
            </div>
            <Text className="tour-card-price-note">Giá tham khảo/người</Text>
          </div>

          <Button type="primary" className="tour-card-button">
            Xem chi tiết
          </Button>
        </div>
      </div>
    </Card>
  )
}
