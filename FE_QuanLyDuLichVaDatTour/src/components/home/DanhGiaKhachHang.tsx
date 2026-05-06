import './DanhGiaKhachHang.css'
import { Avatar, Card, Col, Empty, Rate, Row, Skeleton, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { CommentOutlined } from '@ant-design/icons'
import { TieuDeMuc } from '../../components/common/TieuDeMuc'
import { resolveApiAssetUrl } from '../../constants/api'
import { layDanhGiaNoiBat } from '../../services/review/review'

const { Paragraph, Text, Title } = Typography

export function DanhGiaKhachHang() {
  const reviewsQuery = useQuery({
    queryKey: ['home', 'featured-reviews'],
    queryFn: () => layDanhGiaNoiBat(3),
  })

  return (
    <Card className="home-section reviews-section" variant="borderless">
      <TieuDeMuc
        title="Khách hàng nói gì về chúng tôi"
        description="Những phản hồi chân thực từ khách hàng đã trải nghiệm dịch vụ."
      />

      {reviewsQuery.isLoading ? (
        <Row gutter={[24, 24]} className="reviews-grid">
          {Array.from({ length: 3 }).map((_, index) => (
            <Col xs={24} md={12} xl={8} key={index}>
              <Card className="review-modern-card" variant="borderless">
                <Skeleton active paragraph={{ rows: 4 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : null}

      {!reviewsQuery.isLoading && reviewsQuery.isError ? (
        <Empty description="Không thể tải đánh giá khách hàng" />
      ) : null}

      {!reviewsQuery.isLoading && !reviewsQuery.isError && (reviewsQuery.data ?? []).length === 0 ? (
        <Empty description="Chưa có đánh giá nào" />
      ) : null}

      {!reviewsQuery.isLoading && !reviewsQuery.isError && (reviewsQuery.data ?? []).length > 0 ? (
        <Row gutter={[24, 24]} className="reviews-grid">
          {(reviewsQuery.data ?? []).map((item) => (
            <Col xs={24} md={12} xl={8} key={item.id}>
              <div className="review-modern-card">
                <div className="review-quote-icon">
                  <CommentOutlined />
                </div>

                <div className="review-content">
                  <Paragraph className="review-text">"{item.noiDung}"</Paragraph>
                </div>

                <div className="review-footer">
                  <Avatar
                    src={resolveApiAssetUrl(item.anhDaiDien) ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.hoTenKhachHang)}`}
                    size={54}
                    className="review-avatar"
                  />
                  <div className="review-user-info">
                    <Title level={5} className="review-user-name">
                      {item.hoTenKhachHang}
                    </Title>
                    <Text className="review-tour-name">Tour {item.tenTour}</Text>
                    <Rate disabled value={item.soSao} className="review-rate" />
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      ) : null}
    </Card>
  )
}
