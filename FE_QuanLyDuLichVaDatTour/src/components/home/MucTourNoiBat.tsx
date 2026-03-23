import { Alert, Button, Card, Col, Empty, Row, Skeleton, Space, Tag, Typography } from 'antd'
import { useTourNoiBat } from '../../services/home/useTourNoiBat'
import { TieuDeMuc } from '../common/TieuDeMuc'
import { formatTien } from '../../utils/formatTien'

const { Paragraph, Text, Title } = Typography

export function MucTourNoiBat() {
  const { data, error, isLoading, refetch } = useTourNoiBat()

  return (
    <Card id="tour-noi-bat" className="home-section">
      <TieuDeMuc
        title="Tour nổi bật cho kỳ nghỉ sắp tới"
        description="Lựa chọn nhanh những hành trình đang mở bán để dễ so sánh điểm đến, thời lượng và mức giá phù hợp."
      />

      {isLoading ? (
        <Row gutter={[16, 16]}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Col xs={24} xl={8} key={index}>
              <Card className="featured-tour-card">
                <Skeleton active paragraph={{ rows: 6 }} />
              </Card>
            </Col>
          ))}
        </Row>
      ) : null}

      {!isLoading && error ? (
        <Alert
          type="error"
          showIcon
          message="Không tải được tour nổi bật"
          description="Hãy kiểm tra API /api/tour/get-all hoặc tải lại để tiếp tục xem các tour đang mở bán."
          action={<Button onClick={() => refetch()}>Thử lại</Button>}
        />
      ) : null}

      {!isLoading && !error && (!data || data.length === 0) ? (
        <Empty description="Chưa có tour nổi bật để hiển thị" />
      ) : null}

      {!isLoading && !error && data && data.length > 0 ? (
        <Row gutter={[16, 16]}>
          {data.map((tour) => (
            <Col xs={24} xl={8} key={tour.id}>
              <Card className="featured-tour-card">
                <div className="featured-tour-cover" />
                <Space direction="vertical" size={14} style={{ width: '100%', marginTop: 18 }}>
                  <Space wrap>
                    <Tag color="blue">{tour.tenLoaiTour}</Tag>
                    <Tag color="gold">{tour.soNgay} ngày {tour.soDem} đêm</Tag>
                  </Space>

                  <Space direction="vertical" size={4}>
                    <Title level={4} style={{ marginBottom: 0 }}>
                      {tour.tenTour}
                    </Title>
                    <Text className="featured-tour-meta">Khởi hành từ {tour.tenDiaDiemKhoiHanh}</Text>
                  </Space>

                  <Paragraph style={{ marginBottom: 0 }}>
                    {tour.moTaNgan ?? 'Hành trình được thiết kế để dễ theo dõi lịch trình và lựa chọn lịch khởi hành phù hợp.'}
                  </Paragraph>

                  <Space direction="vertical" size={4}>
                    <Text className="featured-tour-meta">Phương tiện: {tour.phuongTien ?? 'Đang cập nhật'}</Text>
                    <Text className="featured-tour-meta">Mã tour: {tour.maTour}</Text>
                  </Space>

                  <Title level={3} className="featured-tour-price" style={{ margin: 0 }}>
                    Từ {formatTien(tour.giaNguoiLonMacDinh)}
                  </Title>

                  <Button type="primary" block href="#lich-khoi-hanh">
                    Xem lịch khởi hành
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
