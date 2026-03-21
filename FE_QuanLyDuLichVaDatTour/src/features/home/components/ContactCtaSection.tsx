import { Button, Card, Space, Typography } from 'antd'

const { Paragraph, Title } = Typography

export function ContactCtaSection() {
  return (
    <Card id="tu-van-tour" className="home-section cta-section" bordered={false}>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Title level={2} className="cta-title" style={{ margin: 0 }}>
          Bạn muốn tư vấn lịch trình, giá tour hoặc hỗ trợ booking?
        </Title>
        <Paragraph className="cta-description" style={{ marginBottom: 0 }}>
          Đây là vị trí hợp lý để mở rộng sang luồng liên hệ, phản hồi khách hàng, hỗ trợ đặt tour và
          theo dõi booking sau này.
        </Paragraph>
        <Space wrap>
          <Button type="primary" size="large">
            Liên hệ tư vấn
          </Button>
          <Button size="large" ghost>
            Xem lộ trình phát triển tiếp
          </Button>
        </Space>
      </Space>
    </Card>
  )
}
