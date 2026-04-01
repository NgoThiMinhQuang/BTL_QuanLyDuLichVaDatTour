import './MucGioiThieu.css'
import { Button, Card, Col, Row, Space, Typography } from 'antd'
import aboutImage from '../../assets\/Banner.jpg'

const { Paragraph, Title, Text } = Typography

const highlights = [
  'Hơn 10 năm kinh nghiệm',
  'Đội ngũ chuyên nghiệp',
  'Giá cả hợp lý',
  'Dịch vụ 24/7',
]

export function MucGioiThieu() {
  return (
    <Card className="home-section about-us-section" variant="borderless">
      <Row gutter={[40, 40]} align="middle">
        <Col xs={24} xl={13}>
          <Space direction="vertical" size={28} className="about-us-content">
            <Text className="about-us-badge">VỀ CHÚNG TÔI</Text>

            <Space direction="vertical" size={18}>
              <Title className="about-us-title">Chúng Tôi Là Ai?</Title>
              <Paragraph className="about-us-description">
                <strong>Travel Viet</strong> là công ty du lịch tại Việt Nam, chuyên tổ chức các tour du lịch
                chất lượng cao với hơn 10 năm kinh nghiệm trong ngành. Chúng tôi tự hào đã phục vụ hơn
                10,000 khách hàng và mang đến những trải nghiệm du lịch đáng nhớ.
              </Paragraph>
              <Paragraph className="about-us-description">
                Với đội ngũ hướng dẫn viên chuyên nghiệp, giàu kinh nghiệm và đam mê du lịch, chúng tôi
                cam kết mang đến cho bạn những hành trình khám phá đầy thú vị, an toàn và tiết kiệm.
              </Paragraph>
            </Space>

            <div className="about-us-features-grid">
              {highlights.map((item) => (
                <div key={item} className="about-us-feature-item">
                  <span className="about-us-feature-icon">✓</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <Button type="primary" size="large" className="about-us-button" href="#tu-van-tour">
              Liên hệ với chúng tôi
            </Button>
          </Space>
        </Col>

        <Col xs={24} xl={11}>
          <div className="about-us-visual">
            <img src={aboutImage} alt="Giới thiệu Travel Viet" className="about-us-image" />

            <Card className="about-us-award-card" variant="borderless">
              <div className="about-us-award-icon">🏆</div>
              <Title level={4} className="about-us-award-title">
                Đánh giá
              </Title>
              <Paragraph className="about-us-award-description">
                Công ty du lịch tốt nhất năm 2025
              </Paragraph>
            </Card>
          </div>
        </Col>
      </Row>
    </Card>
  )
}
