import { Card, Col, Rate, Row, Space, Typography } from 'antd'
import { reviewItems } from '../data/homeMocks'
import { SectionHeader } from './SectionHeader'

const { Paragraph, Text, Title } = Typography

export function CustomerReviewSection() {
  return (
    <Card className="home-section">
      <SectionHeader
        title="Khách hàng nói gì về trải nghiệm tìm tour và lên kế hoạch chuyến đi"
        description="Những phản hồi ngắn gọn giúp bạn hình dung rõ hơn về cảm giác sử dụng trang web và cách thông tin tour được trình bày."
      />

      <Row gutter={[16, 16]}>
        {reviewItems.map((item) => (
          <Col xs={24} xl={8} key={item.id}>
            <Card className="review-card">
              <Space direction="vertical" size={12}>
                <Space direction="vertical" size={2}>
                  <Title level={5} style={{ margin: 0 }}>
                    {item.name}
                  </Title>
                  <Text type="secondary">Trải nghiệm với tour {item.tour}</Text>
                </Space>
                <Rate disabled value={item.rating} />
                <Paragraph style={{ marginBottom: 0 }}>{item.comment}</Paragraph>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  )
}
