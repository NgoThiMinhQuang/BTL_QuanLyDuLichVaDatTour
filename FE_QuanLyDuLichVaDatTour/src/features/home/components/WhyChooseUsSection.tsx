import { Card, Col, Row, Space, Typography } from 'antd'
import { benefitItems } from '../data/homeMocks'
import { SectionHeader } from './SectionHeader'

const { Paragraph, Title } = Typography

export function WhyChooseUsSection() {
  return (
    <Card id="ly-do-chon" className="home-section">
      <SectionHeader
        title="Vì sao nhiều khách hàng chọn chúng tôi cho chuyến đi tiếp theo"
        description="Không chỉ đẹp về hình ảnh, hành trình còn được trình bày rõ ràng để bạn dễ chọn tour, so sánh lịch khởi hành và lên kế hoạch phù hợp."
      />

      <Row gutter={[16, 16]}>
        {benefitItems.map((item) => (
          <Col xs={24} md={12} key={item.id}>
            <Card className="benefit-card">
              <Space direction="vertical" size={12}>
                <span className="benefit-icon">{item.icon}</span>
                <Title level={4} style={{ margin: 0 }}>
                  {item.title}
                </Title>
                <Paragraph style={{ marginBottom: 0 }}>{item.description}</Paragraph>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  )
}
