import { Alert, Button, Card, Col, Empty, Row, Skeleton, Space, Tag, Typography } from 'antd'
import type { FeaturedTourApiItem } from '../../libs/types/tour'
import { useLichKhoiHanhGan } from '../../services/home/useLichKhoiHanhGan'
import { TieuDeMuc } from '../../common/components/TieuDeMuc'
import { formatNgay } from '../../libs/helpers/formatNgay'

const { Paragraph, Text, Title } = Typography

interface MucLichKhoiHanhProps {
  tours: FeaturedTourApiItem[]
}

export function MucLichKhoiHanh({ tours }: MucLichKhoiHanhProps) {
  const { data, error, isLoading, refetch } = useLichKhoiHanhGan(tours)

  return (
    <Card id="lich-khoi-hanh" className="home-section departures-section">
      <TieuDeMuc
        title="Lịch khởi hành sắp tới"
        description="Chọn đợt khởi hành phù hợp để dễ lên kế hoạch, theo dõi thời gian và chuẩn bị đặt tour nhanh hơn."
      />

      {isLoading ? (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 4 }).map((_, index) => (
            <Col xs={24} md={12} xl={6} key={index}>
              <Card className="departure-card">
                <Skeleton active paragraph={{ rows: 4 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : null}

      {!isLoading && error ? (
        <Alert
          type="warning"
          showIcon
          title="Không tải được lịch khởi hành"
          description="Bạn vẫn có thể xem tour nổi bật, sau đó tải lại để xem các đợt khởi hành gần nhất."
          action={<Button onClick={() => refetch()}>Thử lại</Button>}
        />
      ) : null}

      {!isLoading && !error && (!data || data.length === 0) ? (
        <Empty description="Chưa có lịch khởi hành phù hợp để hiển thị" />
      ) : null}

      {!isLoading && !error && data && data.length > 0 ? (
        <Row gutter={[16, 16]}>
          {data.map((item) => (
            <Col xs={24} md={12} xl={6} key={item.id}>
              <Card className="departure-card">
                <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                  <Space wrap>
                    <Tag color="blue">{formatNgay(item.ngayKhoiHanh)}</Tag>
                    <Tag color="cyan">{item.maDotTour}</Tag>
                  </Space>

                  <Space orientation="vertical" size={4}>
                    <Title level={4} style={{ margin: 0 }}>
                      {item.tenTour}
                    </Title>
                    <Text className="departure-meta">Mã tour: {item.maTour}</Text>
                  </Space>

                  <Paragraph style={{ marginBottom: 0 }}>
                    Từ {formatNgay(item.ngayKhoiHanh)} đến {formatNgay(item.ngayKetThuc)}
                  </Paragraph>

                  <Text className="departure-meta">
                    {item.noiTapTrung ? `Điểm tập trung: ${item.noiTapTrung}` : 'Điểm tập trung sẽ được cập nhật khi xác nhận.'}
                  </Text>
                  <Text className="departure-meta">Số chỗ tối đa: {item.soChoToiDa}</Text>
                  <Button type="primary" block href="#tour-noi-bat">
                    Xem tour liên quan
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      ) : null}
    </Card>
  )
}
