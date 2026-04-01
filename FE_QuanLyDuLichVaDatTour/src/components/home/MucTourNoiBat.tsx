import './MucTourNoiBat.css'
import { Alert, Button, Card, Col, Empty, Row, Skeleton } from 'antd'
import { Link } from 'react-router'
import { TieuDeMuc } from '../../components/common/TieuDeMuc'
import { PATHS } from '../../paths'
import type { FeaturedTourApiItem } from '../../libs/types/tour'
import { TourThe } from '../tour/TourThe'

interface MucTourNoiBatProps {
  tours: FeaturedTourApiItem[]
  isLoading: boolean
  isError: boolean
  onRetry: () => void
}

export function MucTourNoiBat({ tours, isLoading, isError, onRetry }: MucTourNoiBatProps) {
  const data = tours.slice(0, 3)
  const error = isError
  const refetch = onRetry

  const extra = (
    <Link to={PATHS.tour} className="featured-tour-section-link">
      Xem tất cả tour
    </Link>
  )

  const skeletonItems = Array.from({ length: 3 })

  const titleNode = (
    <div className="featured-tour-section-header">
      <TieuDeMuc
        title="Tour nổi bật"
        description="Những tour du lịch được yêu thích nhất tháng này"
      />
      {extra}
    </div>
  )


  return (
    <Card id="tour-noi-bat" className="home-section featured-tour-section" title={titleNode}>
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
              <TourThe
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
    </Card>
  )
}
