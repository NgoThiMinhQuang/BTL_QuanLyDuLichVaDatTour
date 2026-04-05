import './BanDoDuLich.css'
import { EnvironmentOutlined } from '@ant-design/icons'
import { Button, Card, Typography } from 'antd'

const { Paragraph, Title } = Typography

export function BanDoDuLich() {
  return (
    <Card className="home-section home-map-section" variant="borderless">
      <div className="home-map-header">
        <Title className="home-map-title">Khám phá bản đồ du lịch Việt Nam</Title>
        <Paragraph className="home-map-description">
          Xem nhanh các điểm đến nổi bật trải dài từ Bắc vào Nam và mở bản đồ đầy đủ để tìm hành trình phù hợp.
        </Paragraph>
      </div>

      <div className="home-map-frame-wrap">
        <iframe
          className="home-map-frame"
          src="https://www.google.com/maps?q=Vietnam&z=5&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Bản đồ du lịch Việt Nam"
        />

        <div className="home-map-cta-wrap">
          <Button
            type="primary"
            size="large"
            className="home-map-cta"
            href="https://www.google.com/maps?q=Vietnam"
            target="_blank"
            rel="noreferrer"
            icon={<EnvironmentOutlined />}
          >
            Xem bản đồ đầy đủ
          </Button>
        </div>
      </div>
    </Card>
  )
}
