import './BanDoDuLich.css'
import { EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons'
import { Button, Card } from 'antd'
import { TieuDeMuc } from '../../components/common/TieuDeMuc'

export function BanDoDuLich() {
  return (
    <Card className="home-section map-section" variant="borderless">
      <TieuDeMuc
        title="Khám Phá Bản Đồ Du Lịch Việt Nam"
        description="Xem nhanh các điểm đến nổi bật trải dài từ Bắc vào Nam và mở bản đồ đầy đủ để tìm hành trình phù hợp."
      />

      <div className="map-container">
        <div className="map-frame-wrapper">
          <iframe
            className="map-iframe"
            src="https://www.google.com/maps?q=Vietnam&z=5&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ du lịch Việt Nam"
          />
          <div className="map-overlay"></div>
          
          <div className="map-cta-wrapper">
            <Button
              type="primary"
              size="large"
              className="map-cta-button"
              href="https://www.google.com/maps?q=Vietnam"
              target="_blank"
              rel="noreferrer"
              icon={<GlobalOutlined className="map-cta-icon" />}
            >
              Xem Bản Đồ Đầy Đủ
            </Button>
          </div>
          
          {/* Decorative elements */}
          <div className="map-marker-decoration marker-1"><EnvironmentOutlined /></div>
          <div className="map-marker-decoration marker-2"><EnvironmentOutlined /></div>
          <div className="map-marker-decoration marker-3"><EnvironmentOutlined /></div>
        </div>
      </div>
    </Card>
  )
}
