import { Button, Card, Col, Row, Space, Typography } from 'antd'
import { heroStats } from '../data/homeMocks'

const { Paragraph, Text, Title } = Typography

export function HeroSection() {
  return (
    <Card className="home-section hero-section" bordered={false}>
      <div className="hero-overlay" />
      <div className="hero-content">
        <Space direction="vertical" size={22} className="hero-intro">
          <span className="hero-kicker">Khám phá Việt Nam</span>

          <Space direction="vertical" size={14}>
            <Title level={1} className="hero-title" style={{ margin: 0 }}>
              Khám phá vẻ đẹp Việt Nam
            </Title>
            <Paragraph className="hero-description">
              Trải nghiệm những hành trình tuyệt vời và tạo nên kỷ niệm đáng nhớ cùng chúng tôi.
            </Paragraph>
          </Space>

          <Space wrap size={16} className="hero-actions">
            <Button type="primary" size="large" className="hero-primary-button" href="#tour-noi-bat">
              Khám phá Tour
            </Button>
            <Button size="large" className="hero-secondary-button" href="#danh-muc-tour">
              Tìm hiểu thêm
            </Button>
          </Space>
        </Space>

        <div className="hero-stats-wrap">
          <Row gutter={[20, 20]} className="hero-stats-row">
            {heroStats.map((item) => (
              <Col xs={24} md={8} key={item.id}>
                <Card className="hero-stat-card" bordered={false}>
                  <Space direction="vertical" size={8}>
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
      </div>
    </Card>
  )
}
