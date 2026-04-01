import './LichKhoiHanhThe.css'
import { Button, Card, Typography } from 'antd'
import bannerImage from '../../assets/Banner.jpg'
import { Link } from 'react-router'
import { formatNgay } from '../../libs/helpers/formatNgay'
import { formatTien } from '../../libs/helpers/formatTien'
import { getTourChiTietPath } from '../../paths'
import { getCapacityLabel, getSeatBadgeLabel, getSeatStatusClass, type LichKhoiHanhCardItem } from '../../services/lich-khoi-hanh/layTatCaLichKhoiHanh'

const { Paragraph, Text, Title } = Typography

interface LichKhoiHanhTheProps {
  item: LichKhoiHanhCardItem
}

export function LichKhoiHanhThe({ item }: LichKhoiHanhTheProps) {
  const seatStatus = {
    label: getSeatBadgeLabel(item),
    className: getSeatStatusClass(item),
    canBook: item.trangThai !== 'het_cho',
  }
  const duration = `${item.soNgay} ngày ${item.soDem} đêm`
  const tapTrung = item.noiTapTrung ?? item.tenDiaDiemKhoiHanh
  const moTa = item.moTaNgan ?? `Khởi hành ${formatNgay(item.ngayKhoiHanh)} cho hành trình ${item.tenTour.toLowerCase()}.`

  return (
    <Card className="schedule-card" variant="borderless">
      <div
        className="schedule-card-media"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(37, 99, 235, 0.04), rgba(15, 23, 42, 0.12)), url(${bannerImage})`,
        }}
      >
        <span className={`schedule-card-seat-badge ${seatStatus.className}`}>{seatStatus.label}</span>
      </div>

      <div className="schedule-card-content">
        <Text className="schedule-card-region">⌖ {item.khuVuc}</Text>
        <Title level={3} className="schedule-card-title">
          {item.tenTour}
        </Title>

        <div className="schedule-card-meta-list">
          <Text className="schedule-card-meta">🗓 Khởi hành: {formatNgay(item.ngayKhoiHanh)}</Text>
          <Text className="schedule-card-meta">◔ {duration}</Text>
          <Text className="schedule-card-meta">◉ Còn {getCapacityLabel(item)}</Text>
        </div>

        <Paragraph className="schedule-card-description">{moTa}</Paragraph>
        <Text className="schedule-card-meeting-point">Tập trung: {tapTrung}</Text>
      </div>

      <div className="schedule-card-side">
        <Text className="schedule-card-price-label">Giá từ</Text>
        <Title level={2} className="schedule-card-price">
          {formatTien(item.giaNguoiLonMacDinh)}
        </Title>
        <Text className="schedule-card-price-note">Người lớn</Text>
        <Text className="schedule-card-price-child">Trẻ em: {formatTien(item.giaTreEmMacDinh)}</Text>

        <div className="schedule-card-actions">
          <Button size="large" className="schedule-card-secondary-button">
            <Link to={getTourChiTietPath(item.tourId)}>Xem chi tiết</Link>
          </Button>
          <Button type="primary" size="large" className="schedule-card-primary-button" disabled={!seatStatus.canBook}>
            {seatStatus.canBook ? 'Đặt ngay →' : 'Đã hết chỗ'}
          </Button>
        </div>
      </div>
    </Card>
  )
}
