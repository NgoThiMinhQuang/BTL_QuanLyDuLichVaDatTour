import './MucUuDai.css'
import { Button, Card, Col, Row, Space, Typography } from 'antd'

const { Paragraph, Text, Title } = Typography

export function MucUuDai() {
  return (
    <Card id="uu-dai" className="home-section promo-section" variant="borderless">
      <Row gutter={[24, 24]} align="middle">
        <Col xs={24} lg={16}>
          <Space orientation="vertical" size={12}>
            <Text className="promo-code">Ưu đãi mùa hè • TOURHE2026</Text>
            <Title level={2} className="promo-title">
              Đặt tour sớm để giữ chỗ đẹp cho những hành trình đang được quan tâm nhiều nhất
            </Title>
            <Paragraph className="promo-description">
              Khám phá các tour nổi bật, xem lịch khởi hành gần nhất và nhận thêm ưu đãi khi bạn
              lên kế hoạch chuyến đi sớm cùng gia đình hoặc nhóm bạn.
            </Paragraph>
          </Space>
        </Col>
        <Col xs={24} lg={8}>
          <Button type="primary" size="large" block href="#tour-noi-bat">
            Xem tour ưu tiên
          </Button>
        </Col>
      </Row>
    </Card>
  )
}
