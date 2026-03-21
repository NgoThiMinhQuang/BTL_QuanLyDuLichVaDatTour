import { Button, Card, Col, Input, Row, Space, Tag, Typography } from 'antd'
import { heroStats, searchSuggestions } from '../data/homeMocks'

const { Paragraph, Text, Title } = Typography

export function HeroSection() {
  return (
    <Card className="home-section hero-section" bordered={false}>
      <div className="hero-overlay" />
      <div className="hero-content">
        <Space direction="vertical" size={22} className="hero-intro">
          <span className="hero-kicker">Khám phá Việt Nam</span>

          <Space direction="vertical" size={12}>
            <Title level={1} className="hero-title" style={{ margin: 0 }}>
              Khám phá vẻ đẹp Việt Nam qua những hành trình được thiết kế rõ ràng và dễ đặt tour
            </Title>
            <Paragraph className="hero-description">
              Giao diện trang chủ được nâng cấp theo hướng landing page du lịch hiện đại: nổi bật
              trải nghiệm khám phá, dễ xem danh mục tour, dễ tiếp cận tư vấn và sẵn sàng mở rộng
              sang booking, lịch khởi hành, thanh toán và đánh giá.
            </Paragraph>
          </Space>

          <Space wrap size={12} className="hero-actions">
            <Button type="primary" size="large" className="hero-primary-button" href="#danh-muc-tour">
              Khám phá tour
            </Button>
            <Button size="large" className="hero-secondary-button" href="#tu-van-tour">
              Tìm hiểu thêm
            </Button>
          </Space>
        </Space>

        <Card className="hero-search" bordered={false}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} lg={9}>
              <Text className="hero-search-label">Tìm nhanh theo điểm đến</Text>
              <Input size="large" placeholder="Ví dụ: Đà Nẵng, Phú Quốc, Sapa" />
            </Col>
            <Col xs={24} lg={9}>
              <Text className="hero-search-label">Gợi ý đang được ưu tiên phát triển</Text>
              <Space wrap size={8} style={{ display: 'flex', marginTop: 10 }}>
                {searchSuggestions.map((item) => (
                  <Tag key={item.id} className="hero-suggestion-tag">
                    {item.value}
                  </Tag>
                ))}
              </Space>
            </Col>
            <Col xs={24} lg={6}>
              <Button type="primary" size="large" block className="hero-search-button">
                Tìm tour phù hợp
              </Button>
            </Col>
          </Row>
        </Card>

        <Row gutter={[20, 20]} className="hero-stats-row">
          {heroStats.map((item) => (
            <Col xs={24} md={8} key={item.id}>
              <Card className="hero-stat-card" bordered={false}>
                <Space direction="vertical" size={6}>
                  <Title level={2} className="hero-stat-value" style={{ margin: 0 }}>
                    {item.value}
                  </Title>
                  <Text className="hero-stat-label">{item.label}</Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Card>
  )
}
