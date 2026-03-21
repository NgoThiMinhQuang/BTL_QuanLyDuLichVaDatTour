import { Button, Card, Col, Row, Space, Typography } from 'antd'

const { Paragraph, Text, Title } = Typography

export function PromoSection() {
  return (
    <Card className="home-section promo-section" bordered={false}>
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} lg={16}>
          <Space direction="vertical" size={12}>
            <Text className="promo-code">ƯU ĐÃI MÔ PHỎNG: TOURHE2026</Text>
            <Title level={2} style={{ margin: 0 }}>
              Sẵn sàng mở rộng cho voucher, giá ngày thường và giá cuối tuần
            </Title>
            <Paragraph style={{ marginBottom: 0 }}>
              Phần khuyến mãi hiện được thiết kế tạm theo nghiệp vụ trong README để sau này nối với
              API voucher, thanh toán và báo giá theo từng lịch khởi hành.
            </Paragraph>
          </Space>
        </Col>
        <Col xs={24} lg={8}>
          <Button type="primary" size="large" block>
            Xem ưu đãi sắp triển khai
          </Button>
        </Col>
      </Row>
    </Card>
  )
}
