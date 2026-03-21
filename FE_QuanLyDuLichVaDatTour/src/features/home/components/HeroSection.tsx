import { Button, Card, Col, Input, Row, Space, Typography } from 'antd'
import { heroStats, searchSuggestions } from '../data/homeMocks'

const { Paragraph, Text, Title } = Typography

export function HeroSection() {
  return (
    <Card className="home-section hero-section">
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        <span className="hero-kicker">Website quản lý du lịch và đặt tour</span>

        <Space direction="vertical" size={10}>
          <Title level={1} className="hero-title" style={{ margin: 0 }}>
            Khám phá tour phù hợp và sẵn sàng mở rộng tới luồng đặt tour hoàn chỉnh
          </Title>
          <Paragraph className="hero-description">
            Trang chủ được thiết kế theo đúng hướng nghiệp vụ khách hàng: xem danh mục tour,
            khám phá gợi ý nổi bật, theo dõi lịch khởi hành và chuẩn bị cho quy trình booking,
            thanh toán, đánh giá sau chuyến đi.
          </Paragraph>
        </Space>

        <Space wrap size={12}>
          <Button type="primary" size="large" href="#danh-muc-tour">
            Khám phá danh mục
          </Button>
          <Button size="large" ghost href="#tu-van-tour">
            Tư vấn đặt tour
          </Button>
        </Space>

        <Card className="hero-search" bordered={false}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} lg={8}>
              <Text className="hero-search-label">Tìm nhanh theo điểm đến</Text>
              <Input size="large" placeholder="Ví dụ: Đà Nẵng, Phú Quốc, Sapa" />
            </Col>
            <Col xs={24} lg={10}>
              <Text className="hero-search-label">Gợi ý nghiệp vụ sẽ triển khai tiếp</Text>
              <Space wrap size={8} style={{ display: 'flex', marginTop: 8 }}>
                {searchSuggestions.map((item) => (
                  <Button key={item.id}>{item.label}: {item.value}</Button>
                ))}
              </Space>
            </Col>
            <Col xs={24} lg={6}>
              <Button type="primary" size="large" block>
                Tìm tour phù hợp
              </Button>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          {heroStats.map((item) => (
            <Col xs={24} md={8} key={item.id}>
              <Card className="hero-stat-card" bordered={false}>
                <Space direction="vertical" size={4}>
                  <Text className="hero-stat-label">{item.label}</Text>
                  <Title level={3} className="hero-stat-value" style={{ margin: 0 }}>
                    {item.value}
                  </Title>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      </Space>
    </Card>
  )
}
