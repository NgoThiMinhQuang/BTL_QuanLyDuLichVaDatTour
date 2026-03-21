import { Alert, Button, Card, Col, Empty, Row, Skeleton, Space, Tag, Typography } from 'antd'
import { useHomeCategories } from '../hooks/useHomeCategories'
import { SectionHeader } from './SectionHeader'

const { Paragraph, Text, Title } = Typography

export function TourCategorySection() {
  const { data, error, isLoading, refetch } = useHomeCategories()

  return (
    <Card id="danh-muc-tour" className="home-section">
      <SectionHeader
        title="Danh mục tour từ API"
        description="Phần này đang dùng dữ liệu thật từ API loại tour để bám sát backend hiện có."
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
          message="Không tải được danh mục tour"
          description="Hãy kiểm tra API backend đang chạy và endpoint /api/loai-tour/get-all có sẵn."
          action={<Button onClick={() => refetch()}>Thử lại</Button>}
        />
      ) : null}

      {!isLoading && !error && data?.length === 0 ? (
        <Empty description="Chưa có danh mục tour để hiển thị" />
      ) : null}

      {!isLoading && !error && data && data.length > 0 ? (
        <Row gutter={[16, 16]}>
          {data.map((item) => (
            <Col xs={24} md={12} xl={8} key={item.id}>
              <Card className="category-card">
                <Space direction="vertical" size={10} style={{ width: '100%' }}>
                  <Tag color="blue">{item.trangThai}</Tag>
                  <Title level={4} style={{ margin: 0 }}>
                    {item.ten}
                  </Title>
                  <Paragraph style={{ marginBottom: 0 }}>
                    {item.moTa || 'Danh mục này đã sẵn sàng để liên kết sang trang danh sách tour sau.'}
                  </Paragraph>
                  <Text type="secondary">ID loại tour: #{item.id}</Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      ) : null}
    </Card>
  )
}
