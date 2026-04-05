import './LyDoChonChungToi.css'
import { Card, Col, Row, Space, Typography } from 'antd'
import { TieuDeMuc } from '../../components/common/TieuDeMuc'

const { Paragraph, Title } = Typography

const benefitItems = [
  {
    id: 1,
    icon: '🎯',
    title: 'Lịch trình rõ ràng',
    description: 'Thông tin tour, giá và lịch khởi hành được trình bày rõ để bạn dễ chọn hơn.',
  },
  {
    id: 2,
    icon: '🛡️',
    title: 'Đặt tour an toàn',
    description: 'Luồng đặt tour được tách rõ từng bước để khách hàng thao tác dễ và ít nhầm hơn.',
  },
  {
    id: 3,
    icon: '💬',
    title: 'Hỗ trợ nhanh',
    description: 'Khách hàng có thể xem tour, lịch khởi hành và gửi nhu cầu tư vấn ngay trên trang chủ.',
  },
  {
    id: 4,
    icon: '⭐',
    title: 'Trải nghiệm tốt',
    description: 'Giao diện được sắp xếp gọn để người dùng dễ xem, dễ so sánh và dễ ra quyết định.',
  },
]

export function LyDoChonChungToi() {
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
