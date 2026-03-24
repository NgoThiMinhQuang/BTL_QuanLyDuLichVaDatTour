import { Button, Card, Typography } from 'antd'
import bannerImage from '../../assets/Banner.jpg'
import { formatNgay } from '../../utils/formatNgay'
import { formatTien } from '../../utils/formatTien'
import type { LichKhoiHanhCardItem } from '../../services/home/layTatCaLichKhoiHanh'

const { Paragraph, Text, Title } = Typography

interface LichKhoiHanhTheProps {
  item: LichKhoiHanhCardItem
}

function getSeatStatus(item: LichKhoiHanhCardItem) {
  if (item.soChoToiDa <= 10) {
    return { label: `Còn ${item.soChoToiDa} chỗ`, className: 'warning' }
  }

  return { label: `Còn ${item.soChoToiDa} chỗ`, className: 'success' }
}

export function LichKhoiHanhThe({ item }: LichKhoiHanhTheProps) {
  const seatStatus = getSeatStatus(item)
  const duration = `${item.soNgay} ngày ${item.soDem} đêm`

  return (
    <Card className="schedule-card" variant="borderless">
      <div className="schedule-card-media" style={{ backgroundImage: `linear-gradient(180deg, rgba(37, 99, 235, 0.08), rgba(15, 23, 42, 0.18)), url(${bannerImage})` }}>
        <span className={`schedule-card-seat-badge ${seatStatus.className}`}>{seatStatus.label}</span>
      </div>

      <div className="schedule-card-content">
        <Text className="schedule-card-region">{item.tenLoaiTour}</Text>
        <Title level={3} className="schedule-card-title">
          {item.tenTour}
        </Title>

        <div className="schedule-card-meta-list">
          <Text className="schedule-card-meta">Khởi hành: {formatNgay(item.ngayKhoiHanh)}</Text>
          <Text className="schedule-card-meta">{duration}</Text>
          <Text className="schedule-card-meta">Tập trung: {item.noiTapTrung ?? item.tenDiaDiemKhoiHanh}</Text>
        </div>

        <Paragraph className="schedule-card-description">
          {item.moTaNgan ?? `Lịch khởi hành ${item.maDotTour} phù hợp cho hành trình ${item.tenTour.toLowerCase()}.`}
        </Paragraph>
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
            Xem chi tiết
          </Button>
          <Button type="primary" size="large" className="schedule-card-primary-button">
            Đặt ngay →
          </Button>
        </div>
      </div>
    </Card>
  )
}