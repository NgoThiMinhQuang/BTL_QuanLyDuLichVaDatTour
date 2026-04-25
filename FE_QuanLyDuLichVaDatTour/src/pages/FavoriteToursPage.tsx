import './TourPage.css'
import { Button, Col, Empty, Row, Typography } from 'antd'
import { Link } from 'react-router'
import { TheTour } from '../components/tour/TheTour'
import { PATHS } from '../constants/paths'
import { useFavoriteTourStore } from '../store/favoriteTourStore'

const { Paragraph, Title } = Typography

export default function FavoriteToursPage() {
  const favoriteTours = useFavoriteTourStore((state) => state.favoriteTours)

  return (
    <div className="tour-page">
      <div className="tour-page-header">
        <Title className="tour-page-title">Tour yêu thích của tôi</Title>
        <Paragraph className="tour-results-count">Bạn đã lưu {favoriteTours.length} tour yêu thích</Paragraph>
      </div>

      {favoriteTours.length === 0 ? (
        <Empty
          description="Bạn chưa có tour yêu thích nào"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button type="primary">
            <Link to={PATHS.tour}>Khám phá tour</Link>
          </Button>
        </Empty>
      ) : (
        <Row gutter={[20, 20]} className="tour-grid">
          {favoriteTours.map((tour, index) => (
            <Col xs={24} md={12} xl={8} key={tour.id}>
              <TheTour tour={tour} imageIndex={index} viewMode="grid" />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
