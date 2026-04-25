import './MucLichKhoiHanhGan.css'
import { Alert, Button, Card, Col, Empty, Row, Skeleton, Tag, Typography } from 'antd'
import type { FeaturedTourApiItem } from '../../types/tour'
import { useLichKhoiHanhGan } from '../../services/home/useLichKhoiHanhGan'
import { TieuDeMuc } from '../../components/common/TieuDeMuc'
import { formatDate } from '../../utils/formatDate'
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  TeamOutlined, 
  TagOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined
} from '@ant-design/icons'

const { Title } = Typography

interface MucLichKhoiHanhGanProps {
  tours: FeaturedTourApiItem[]
}

export function MucLichKhoiHanhGan({ tours }: MucLichKhoiHanhGanProps) {
  const { data, error, isLoading, refetch } = useLichKhoiHanhGan(tours)

  return (
    <Card id="lich-khoi-hanh" className="home-section departures-section" variant="borderless">
      <TieuDeMuc
        title="Lịch khởi hành sắp tới"
        description="Chọn đợt khởi hành phù hợp để dễ lên kế hoạch, theo dõi thời gian và chuẩn bị đặt tour nhanh hơn."
      />

      {isLoading ? (
        <Row gutter={[24, 24]}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Col xs={24} md={12} xl={6} key={index}>
              <div className="departure-glass-card skeleton">
                <Skeleton active paragraph={{ rows: 5 }} />
              </div>
            </Col>
          ))}
        </Row>
      ) : null}

      {!isLoading && error ? (
        <Alert
          type="warning"
          showIcon
          title="Không tải được lịch khởi hành"
          description="Bạn vẫn có thể xem tour nổi bật, sau đó tải lại để xem các đợt khởi hành gần nhất."
          action={<Button onClick={() => refetch()}>Thử lại</Button>}
        />
      ) : null}

      {!isLoading && !error && (!data || data.length === 0) ? (
        <Empty description="Chưa có lịch khởi hành phù hợp để hiển thị" />
      ) : null}

      {!isLoading && !error && data && data.length > 0 ? (
        <Row gutter={[24, 24]}>
          {data.map((item) => {
            const dateObj = new Date(item.ngayKhoiHanh);
            const day = dateObj.getDate();
            const month = dateObj.getMonth() + 1;
            const isSoldOut = item.trangThai === 'het_cho' || item.soChoConLai <= 0
            
            // Tìm ảnh của tour tương ứng để làm background
            const matchingTour = tours.find(t => t.id === item.tourId);
            const tourImage = matchingTour?.anhTours.find(img => img.isAvatar)?.linkAnh || matchingTour?.anhTours[0]?.linkAnh;
            
            return (
              <Col xs={24} md={12} xl={6} key={item.id}>
                <div className="departure-glass-card">
                  {/* Ảnh nền phủ card */}
                  <div className="departure-card-image-bg">
                    {tourImage ? (
                      <img src={tourImage} alt={item.tenTour} className="bg-img" />
                    ) : (
                      <div className="bg-placeholder" />
                    )}
                    <div className="bg-overlay" />
                  </div>

                  {/* Phần cố định ở trên */}
                  <div className="departure-card-header">
                    <div className="departure-date-badge">
                      <span className="day">{day < 10 ? `0${day}` : day}</span>
                      <span className="month">Th {month}</span>
                    </div>
                    <Tag className="departure-id-tag"><TagOutlined /> {item.maDotTour}</Tag>
                  </div>

                  {/* Phần nội dung trượt lên khi hover */}
                  <div className="departure-card-content">
                    <div className="content-inner">
                      <Title level={4} className="departure-title">
                        {item.tenTour}
                      </Title>
                      
                      <div className="departure-meta-list">
                        <div className="departure-meta-item">
                          <ClockCircleOutlined className="meta-icon" />
                          <span className="meta-text">Mã tour: {item.maTour}</span>
                        </div>
                        <div className="departure-meta-item">
                          <CalendarOutlined className="meta-icon" />
                          <span className="meta-text">Từ {formatDate(item.ngayKhoiHanh)} đến {formatDate(item.ngayKetThuc)}</span>
                        </div>
                        <div className="departure-meta-item">
                          <EnvironmentOutlined className="meta-icon" />
                          <span className="meta-text" title={item.noiTapTrung}>
                            {item.noiTapTrung || 'Điểm tập trung: Đang cập nhật...'}
                          </span>
                        </div>
                        <div className="departure-meta-item">
                          <TeamOutlined className="meta-icon" />
                          <span className="meta-text">{isSoldOut ? 'Đã hết chỗ' : `Còn ${item.soChoConLai} chỗ • Đã đặt ${item.soChoDaDat}/${item.soChoToiDa}`}</span>
                        </div>
                      </div>

                      <div className="departure-card-footer">
                        <Button
                          type="primary"
                          block
                          className="departure-action-btn"
                          href="#tour-noi-bat"
                          icon={<ArrowRightOutlined />}
                          iconPosition="end"
                          disabled={isSoldOut}
                        >
                          {isSoldOut ? 'Đã hết chỗ' : 'Xem tour liên quan'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      ) : null}
    </Card>
  )
}
