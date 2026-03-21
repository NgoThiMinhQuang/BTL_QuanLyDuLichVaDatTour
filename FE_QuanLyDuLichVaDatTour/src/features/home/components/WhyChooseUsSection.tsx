import { Card, Col, Row, Space, Typography } from 'antd'
import { benefitItems } from '../data/homeMocks'
import { SectionHeader } from './SectionHeader'

const { Paragraph, Title } = Typography

export function WhyChooseUsSection() {
  return (
    <Card id="ly-do-chon" className="home-section">
      <SectionHeader
        title="Vì sao bố cục này phù hợp đề tài"
        description="Các khối nội dung được sắp theo luồng khách hàng thực tế: khám phá, so sánh, tin tưởng, rồi liên hệ hoặc đặt tour."
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
