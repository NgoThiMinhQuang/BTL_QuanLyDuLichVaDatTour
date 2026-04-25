import './LyDoChonChungToi.css'
import { Card, Col, Row, Typography } from 'antd'
import { TieuDeMuc } from '../../components/common/TieuDeMuc'
import { 
  AimOutlined, 
  SafetyCertificateOutlined, 
  CustomerServiceOutlined, 
  StarOutlined 
} from '@ant-design/icons'
import React from 'react'

const { Paragraph, Title } = Typography

const benefitItems = [
  {
    id: 1,
    icon: <AimOutlined />,
    title: 'Lịch trình rõ ràng',
    description: 'Thông tin tour, giá và lịch khởi hành được trình bày rõ ràng, minh bạch giúp bạn dễ dàng so sánh và lựa chọn hành trình ưng ý.',
    color: '#3b82f6'
  },
  {
    id: 2,
    icon: <SafetyCertificateOutlined />,
    title: 'Đặt tour an toàn',
    description: 'Quy trình đặt tour được chuẩn hóa qua từng bước đơn giản, bảo mật thông tin và hỗ trợ thanh toán linh hoạt, nhanh chóng.',
    color: '#10b981'
  },
  {
    id: 3,
    icon: <CustomerServiceOutlined />,
    title: 'Hỗ trợ chuyên nghiệp',
    description: 'Đội ngũ tư vấn viên am hiểu và tận tâm luôn sẵn sàng giải đáp mọi thắc mắc của bạn qua đa dạng kênh liên lạc ngay lập tức.',
    color: '#f59e0b'
  },
  {
    id: 4,
    icon: <StarOutlined />,
    title: 'Trải nghiệm tối ưu',
    description: 'Giao diện hiện đại, tốc độ truy cập nhanh giúp bạn tìm kiếm và đặt tour chỉ trong vài cú nhấp chuột trên mọi thiết bị.',
    color: '#8b5cf6'
  },
]

export function LyDoChonChungToi() {
  return (
    <Card id="ly-do-chon" className="home-section benefits-section" variant="borderless">
      <TieuDeMuc
        title="Vì sao hàng ngàn khách hàng tin tưởng chúng tôi"
        description="Chúng tôi không chỉ cung cấp những chuyến đi, mà còn mang đến sự an tâm và trải nghiệm du lịch hoàn hảo nhất cho bạn."
      />

      <Row gutter={[24, 24]} className="benefits-grid">
        {benefitItems.map((item) => (
          <Col xs={24} lg={12} key={item.id}>
            <div className="benefit-modern-card" style={{ '--theme-color': item.color } as React.CSSProperties}>
              <div className="benefit-icon-wrapper">
                {item.icon}
              </div>
              <div className="benefit-content">
                <Title level={4} className="benefit-title">
                  {item.title}
                </Title>
                <Paragraph className="benefit-description">
                  {item.description}
                </Paragraph>
              </div>
              
              {/* Decorative background shape */}
              <div className="benefit-card-decoration" />
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  )
}
