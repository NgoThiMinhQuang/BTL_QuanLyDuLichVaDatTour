import './TheTour.css'
import { Button, Card, Rate, Typography } from 'antd'
import { CalendarOutlined, EnvironmentOutlined, HeartFilled, HeartOutlined, TagOutlined, TeamOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router'
import { getTourChiTietPath } from '../../constants/paths'
import bannerImage from '../../assets/Banner.jpg'
import { resolveApiAssetUrl } from '../../constants/api'
import type { FeaturedTourApiItem } from '../../types/tour'
import { formatDate } from '../../utils/formatDate'
import { formatMoney } from '../../utils/formatMoney'
import { useFavoriteTourStore } from '../../store/favoriteTourStore'

const { Text, Title } = Typography

function formatTrangThai(trangThai?: string | null) {
  if (!trangThai?.trim()) {
    return 'Đang cập nhật'
  }

  const normalized = trangThai.trim().toLowerCase()

  switch (normalized) {
    case 'dang_mo_ban':
      return 'Đang mở bán'
    case 'nhap':
      return 'Nháp'
    case 'tam_ngung':
      return 'Tạm ngưng'
    case 'an':
      return 'Ẩn'
    case 'ngung_kinh_doanh':
      return 'Ngừng kinh doanh'
    default:
      return 'Đang cập nhật'
  }
}

interface TheTourProps {
  tour: FeaturedTourApiItem
  imageIndex: number
  viewMode: 'grid' | 'list'
  ctaLabel?: string
  ctaHref?: string
  variant?: 'default' | 'featured'
}

const tourGradients = [
  'linear-gradient(135deg, rgba(11, 90, 160, 0.32), rgba(11, 90, 160, 0.08))',
  'linear-gradient(135deg, rgba(22, 163, 74, 0.28), rgba(22, 163, 74, 0.08))',
  'linear-gradient(135deg, rgba(2, 132, 199, 0.28), rgba(2, 132, 199, 0.08))',
  'linear-gradient(135deg, rgba(234, 88, 12, 0.26), rgba(234, 88, 12, 0.08))',
]
export function TheTour({
  tour,
  imageIndex,
  viewMode,
  ctaLabel = 'Xem chi tiết',
  ctaHref = getTourChiTietPath(tour.id),
  variant = 'default',
}: TheTourProps) {
  const coverImage = [...tour.anhTours].sort(
    (a, b) => Number(b.isAvatar) - Number(a.isAvatar) || a.thuTu - b.thuTu,
  )[0]?.linkAnh

  const normalizedCoverImage = resolveApiAssetUrl(coverImage) ?? bannerImage

  const backgroundImage = `${tourGradients[imageIndex % tourGradients.length]}, url(${normalizedCoverImage})`
  const duration = `${tour.soNgay}N${tour.soDem}Đ`
  const statusLabel = formatTrangThai(tour.trangThai)
  const cardClassName = [
    'tour-card',
    viewMode === 'list' ? 'tour-card-list' : '',
    variant === 'featured' ? 'tour-card-featured' : '',
  ]
    .filter(Boolean)
    .join(' ')
  const navigate = useNavigate()
  const isFavorite = useFavoriteTourStore((state) => state.isFavorite(tour.id))
  const toggleFavorite = useFavoriteTourStore((state) => state.toggleFavorite)
  const displayPrice = tour.giaThapNhat ?? tour.giaNguoiLonMacDinh

  return (
    <Card className={cardClassName} variant="borderless">
      <div className="tour-card-cover" style={{ backgroundImage }}>
        <div className="tour-card-badges">
          <span className="tour-card-status">{statusLabel}</span>
          {variant === 'featured' && <span className="tour-card-badge-hot">Bán chạy</span>}
        </div>
        <button
          type="button"
          className={`tour-card-favorite ${isFavorite ? 'tour-card-favorite-active' : ''}`}
          aria-label={isFavorite ? 'Bỏ yêu thích tour' : 'Yêu thích tour'}
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            toggleFavorite(tour)
          }}
        >
          {isFavorite ? <HeartFilled /> : <HeartOutlined />}
        </button>
        <span className="tour-card-code">{tour.maTour}</span>
      </div>

      <div className="tour-card-body">
        <div className="tour-card-main">
          <div className="tour-card-rating-row">
            <Rate disabled allowHalf value={tour.averageRating ?? 0} className="tour-card-rate" />
            <span className="tour-card-review-count">({tour.totalReviews ?? 0} đánh giá)</span>
          </div>

          <Title level={3} className="tour-card-title">
            <Link to={ctaHref}>{tour.tenTour}</Link>
          </Title>

          <div className="tour-card-meta-list">
            <Text className="tour-card-meta">
              <EnvironmentOutlined /> Từ {tour.tenDiaDiemKhoiHanh}
            </Text>
            <Text className="tour-card-meta">
              <CalendarOutlined /> {duration} • {tour.phuongTien ?? 'Đang cập nhật'}
            </Text>
            <Text className="tour-card-meta">
              <TagOutlined /> {tour.tenLoaiTour}
            </Text>
            {tour.soChoConLai > 0 && (
              <Text className="tour-card-meta tour-card-seats-available">
                <TeamOutlined /> Còn {tour.soChoConLai} chỗ
              </Text>
            )}
            {tour.ngayKhoiHanhGanNhat && (
              <Text className="tour-card-meta tour-card-next-departure">
                <CalendarOutlined /> Khởi hành: {formatDate(tour.ngayKhoiHanhGanNhat)}
              </Text>
            )}
          </div>
        </div>

        <div className="tour-card-footer">
          <div className="tour-card-price-block">
            <Text className="tour-card-price-label">Giá trọn gói</Text>
            <div className="tour-card-price-row">
              <Title level={2} className="tour-card-price-current">
                {formatMoney(displayPrice)}
              </Title>
            </div>
          </div>
          <Button type="primary" className="tour-card-button" onClick={() => navigate(ctaHref)}>
            {ctaLabel}
          </Button>
        </div>
      </div>
    </Card>
  )
}
