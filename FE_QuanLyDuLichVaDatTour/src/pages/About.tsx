import './Home/Home.css'
import { Card, Space, Typography } from 'antd'

const { Paragraph, Title } = Typography

export default function About() {
  return (
    <Card className="home-section">
      <Space orientation="vertical" size={12}>
        <Title level={2} style={{ margin: 0 }}>
          Giới thiệu đề tài
        </Title>
        <Paragraph>
          Đây là frontend cho bài toán quản lý du lịch và đặt tour với 2 vai trò chính: Admin và
          Khách hàng. Trang chủ đang ưu tiên trải nghiệm khách hàng, còn các module như booking,
          thanh toán, lịch khởi hành và đánh giá sẽ được mở rộng tiếp theo.
        </Paragraph>
      </Space>
    </Card>
  )
}
