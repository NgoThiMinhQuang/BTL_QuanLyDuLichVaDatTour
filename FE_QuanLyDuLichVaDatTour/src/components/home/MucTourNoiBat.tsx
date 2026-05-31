import './MucTourNoiBat.css'
import { ArrowRightOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Col, Empty, Row, Skeleton } from 'antd'
import { Link } from 'react-router'
import { TieuDeMuc } from '../../components/common/TieuDeMuc'
import { PATHS } from '../../constants/paths'
import type { FeaturedTourApiItem } from '../../types/tour'
import { TheTour } from '../tour/TheTour'

interface MucTourNoiBatProps {
  tours: FeaturedTourApiItem[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

export function MucTourNoiBat({ tours, isLoading, isError, onRetry }: MucTourNoiBatProps) {
  const data = tours
  const error = isError
  const refetch = onRetry

  const extra = (
    <Link to={PATHS.tour} className="featured-tour-section-link">
      Khám phá tất cả <ArrowRightOutlined />
    </Link>
  )

  const skeletonItems = Array.from({ length: 3 })

  return (
    <Card id="tour-noi-bat" className="home-section featured-tour-section" variant="borderless">
      <TieuDeMuc
        title="Tour nổi bật"
        description="Những hành trình độc đáo, được tuyển chọn kỹ lưỡng dành riêng cho bạn"
      />

      <div className="featured-tour-content">
        {isLoading ? (
          <Row gutter={[20, 20]} className="featured-tour-grid">
            {skeletonItems.map((_, index) => (
              <Col xs={24} md={12} xl={8} key={index}>
                <Card className="tour-card tour-card-skeleton" variant="borderless">
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
            title="Không tải được tour nổi bật"
            description="Hãy kiểm tra API /api/tour/get-all hoặc tải lại để tiếp tục xem các tour đang mở bán."
            action={<Button onClick={() => refetch()}>Thử lại</Button>}
          />
        ) : null}

        {!isLoading && !error && (!data || data.length === 0) ? (
          <Empty description="Chưa có tour nổi bật để hiển thị" />
        ) : null}

        {!isLoading && !error && data && data.length > 0 ? (
          <Row gutter={[20, 20]} className="featured-tour-grid">
            {data.map((tour, index) => (
              <Col xs={24} md={12} xl={8} key={tour.id}>
{/* // Hiển thị từng tour thành một card */}
                <TheTour
                  tour={tour}
                  imageIndex={index}
                  viewMode="grid"
                  ctaLabel="Xem chi tiết"
                  ctaHref={`/tour/${tour.id}`}
                  variant="featured"
                />
              </Col>
            ))}
          </Row>
        ) : null}

        {!isLoading && !error && data && data.length > 0 ? (
          <div className="featured-tour-section-footer">
            {extra}
          </div>
        ) : null}
      </div>
    </Card>
  )
}
