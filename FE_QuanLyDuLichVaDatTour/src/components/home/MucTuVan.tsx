import { Button, Card, Space, Typography } from 'antd'

const { Paragraph, Title } = Typography

export function MucTuVan() {
  return (
    <Card id="tu-van-tour" className="home-section cta-section" variant="borderless">
      <Space orientation="vertical" size={16} style={{ width: '100%' }}>
        <Title level={2} className="cta-title" style={{ margin: 0 }}>
          Bạn cần tư vấn để chọn tour, lịch khởi hành hoặc ngân sách phù hợp?
        </Title>
        <Paragraph className="cta-description" style={{ marginBottom: 0 }}>
          Hãy bắt đầu từ danh mục tour, xem các đợt khởi hành gần nhất hoặc để lại nhu cầu để được hỗ trợ chọn hành trình phù hợp với gia đình, nhóm bạn hay công ty.
        </Paragraph>
        <Space wrap>
          <Button type="primary" size="large" href="#tour-noi-bat">
            Xem tour nổi bật
          </Button>
          <Button size="large" ghost href="#lich-khoi-hanh">
            Xem lịch khởi hành
          </Button>
        </Space>
      </Space>
    </Card>
  )
}
