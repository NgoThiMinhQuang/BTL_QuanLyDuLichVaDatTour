import './MucLoaiTour.css'
import { Alert, Button, Card, Col, Empty, Row, Skeleton, Space, Tag, Typography } from 'antd'
import { useLoaiTour } from '../../services/tour/useLoaiTour'
import { TieuDeMuc } from '../../components/common/TieuDeMuc'

const { Paragraph, Title } = Typography

export function MucLoaiTour() {
  const { data, error, isLoading, refetch } = useLoaiTour()

  return (
    <Card id="danh-muc-tour" className="home-section">
      <TieuDeMuc
        title="Khám phá theo phong cách du lịch bạn yêu thích"
        description="Từ nghỉ dưỡng, trải nghiệm gia đình đến hành trình khám phá, mỗi danh mục sẽ giúp bạn tìm tour phù hợp nhanh hơn."
      />

      {isLoading ? (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Col xs={24} md={12} xl={8} key={index}>
              <Card className="category-card">
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : null}

      {!isLoading && error ? (
        <Alert
          type="error"
          showIcon
          title="Không tải được danh mục tour"
          description="Hãy kiểm tra backend đang chạy hoặc tải lại để xem các danh mục hiện có."
          action={<Button onClick={() => refetch()}>Thử lại</Button>}
        />
      ) : null}

      {!isLoading && !error && data?.length === 0 ? <Empty description="Chưa có danh mục tour để hiển thị" /> : null}

      {!isLoading && !error && data && data.length > 0 ? (
        <Row gutter={[16, 16]}>
          {data.map((item) => (
            <Col xs={24} md={12} xl={8} key={item.id}>
              <Card className="category-card">
                <Space orientation="vertical" size={12} className="category-card-stack">
                  <Tag color="blue">{item.trangThai === 'hoat_dong' ? 'Đang mở' : item.trangThai}</Tag>
                  <Title level={4} className="category-card-title">
                    {item.ten}
                  </Title>
                  <Paragraph className="category-card-description">
                    {item.moTa || 'Danh mục phù hợp để khám phá thêm các tour đang mở bán và lựa chọn hành trình phù hợp.'}
                  </Paragraph>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      ) : null}
    </Card>
  )
}
