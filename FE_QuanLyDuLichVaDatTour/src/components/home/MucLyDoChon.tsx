import './MucLyDoChon.css'
import { Card, Col, Row, Space, Typography } from 'antd'
import { benefitItems } from '../../libs/types/homeMocks'
import { TieuDeMuc } from '../../components/common/TieuDeMuc'

const { Paragraph, Title } = Typography

export function MucLyDoChon() {
  return (
    <Card id="ly-do-chon" className="home-section">
      <TieuDeMuc
        title="Vì sao nhiều khách hàng chọn chúng tôi cho chuyến đi tiếp theo"
        description="Không chỉ đẹp về hình ảnh, hành trình còn được trình bày rõ ràng để bạn dễ chọn tour, so sánh lịch khởi hành và lên kế hoạch phù hợp."
      />

      <Row gutter={[16, 16]}>
        {benefitItems.map((item) => (
          <Col xs={24} md={12} key={item.id}>
            <Card className="benefit-card">
              <Space orientation="vertical" size={12} className="benefit-card-stack">
                <span className="benefit-icon">{item.icon}</span>
                <Title level={4} className="benefit-card-title">
                  {item.title}
                </Title>
                <Paragraph className="benefit-card-description">{item.description}</Paragraph>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  )
}
