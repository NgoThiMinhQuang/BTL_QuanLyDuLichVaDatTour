import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import { featuredTours } from '../data/homeMocks'
import { SectionHeader } from './SectionHeader'

const { Paragraph, Text, Title } = Typography

export function FeaturedToursSection() {
  return (
    <Card id="tour-noi-bat" className="home-section">
      <SectionHeader
        title="Tour nổi bật mô phỏng theo nghiệp vụ"
        description="Dữ liệu tour chi tiết chưa có API công khai, nên phần này dùng mock data đúng ngữ cảnh bài toán du lịch và đặt tour."
      />

      <Row gutter={[16, 16]}>
        {featuredTours.map((tour) => (
          <Col xs={24} xl={8} key={tour.id}>
            <Card className="featured-tour-card">
              <div className="featured-tour-cover" />
              <Space direction="vertical" size={12} style={{ width: '100%', marginTop: 18 }}>
                <Space wrap>
                  <Tag color="cyan">{tour.location}</Tag>
                  <Tag color="gold">{tour.duration}</Tag>
                </Space>

                <div>
                  <Title level={4} style={{ marginBottom: 6 }}>
                    {tour.title}
                  </Title>
                  <Paragraph>{tour.subtitle}</Paragraph>
                </div>

                <Space direction="vertical" size={4}>
                  <Text className="featured-tour-meta">Phương tiện: {tour.transport}</Text>
                  <Text className="featured-tour-meta">Khởi hành: {tour.departure}</Text>
                  <Text className="featured-tour-meta">Điểm nổi bật: {tour.highlight}</Text>
                </Space>

                <Title level={3} className="featured-tour-price" style={{ margin: 0 }}>
                  {tour.price}
                </Title>

                <Button type="primary" block>
                  Xem chi tiết tour
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  )
}
