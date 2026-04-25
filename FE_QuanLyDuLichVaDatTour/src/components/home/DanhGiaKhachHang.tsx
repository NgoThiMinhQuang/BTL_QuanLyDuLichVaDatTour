import './DanhGiaKhachHang.css'
import { Avatar, Card, Col, Rate, Row, Typography } from 'antd'
import { TieuDeMuc } from '../../components/common/TieuDeMuc'
import { CommentOutlined } from '@ant-design/icons'

const { Paragraph, Text, Title } = Typography

const reviewItems = [
  {
    id: 1,
    name: 'Nguyễn Minh Anh',
    tour: 'Đà Nẵng - Hội An',
    rating: 5,
    comment: 'Thông tin tour rõ ràng, xem lịch khởi hành rất dễ và đặt tour cũng thuận tiện.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MinhAnh'
  },
  {
    id: 2,
    name: 'Trần Quốc Bảo',
    tour: 'Phú Quốc',
    rating: 5,
    comment: 'Trang web dễ dùng, bộ lọc tour gọn và phần chi tiết tour trình bày khá đẹp.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QuocBao'
  },
  {
    id: 3,
    name: 'Lê Thu Hà',
    tour: 'Hà Nội - Hạ Long',
    rating: 4,
    comment: 'Dễ theo dõi booking và xem lại đánh giá, phù hợp cho đồ án quản lý du lịch.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ThuHa'
  },
]

export function DanhGiaKhachHang() {
  return (
    <Card className="home-section reviews-section" variant="borderless">
      <TieuDeMuc
        title="Khách hàng nói gì về chúng tôi"
        description="Những phản hồi chân thực từ khách hàng đã trải nghiệm dịch vụ."
      />

      <Row gutter={[24, 24]} className="reviews-grid">
        {reviewItems.map((item) => (
          <Col xs={24} md={12} xl={8} key={item.id}>
            <div className="review-modern-card">
              <div className="review-quote-icon">
                <CommentOutlined />
              </div>
              
              <div className="review-content">
                <Paragraph className="review-text">
                  "{item.comment}"
                </Paragraph>
              </div>

              <div className="review-footer">
                <Avatar src={item.avatar} size={54} className="review-avatar" />
                <div className="review-user-info">
                  <Title level={5} className="review-user-name">
                    {item.name}
                  </Title>
                  <Text className="review-tour-name">Tour {item.tour}</Text>
                  <Rate disabled value={item.rating} className="review-rate" />
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  )
}
