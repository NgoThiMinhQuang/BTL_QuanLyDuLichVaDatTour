import './TourPage.css'
import { Alert, Button, Col, Empty, Row, Spin, Typography } from 'antd'
import { Link } from 'react-router'
import { TheTour } from '../components/tour/TheTour'
import { PATHS } from '../constants/paths'
import { useFavoriteTourStore } from '../store/favoriteTourStore'
import { useQuery } from '@tanstack/react-query'
import { layDanhSachYeuThich } from '../services/yeu-thich/yeuThich'
import { useAuthStore } from '../store/authStore'
import { useEffect } from 'react'

const { Paragraph, Title } = Typography

export default function FavoriteToursPage() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const favoriteTours = useFavoriteTourStore((s) => s.favoriteTours)
  const syncFromApi = useFavoriteTourStore((s) => s.syncFromApi)

  const { data: apiItems, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['favorite-tours'],
    queryFn: layDanhSachYeuThich,
    enabled: !!accessToken,
  })

  useEffect(() => {
    if (apiItems) {
      syncFromApi()
    }
  }, [apiItems, syncFromApi])

  const tours = accessToken ? favoriteTours : favoriteTours

  return (
    <div className="tour-page">
      <div className="tour-page-header">
        <Title className="tour-page-title">Tour yêu thích của tôi</Title>
        <Paragraph className="tour-results-count">Bạn đã lưu {tours.length} tour yêu thích</Paragraph>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <Spin size="large" tip="Đang tải danh sách yêu thích..." />
        </div>
      ) : isError ? (
        <Alert
          type="error"
          message="Không thể tải danh sách yêu thích"
          description={(error as Error)?.message || 'Vui lòng thử lại sau.'}
          action={
            <Button size="small" onClick={() => refetch()}>
              Thử lại
            </Button>
          }
          style={{ marginBottom: 16 }}
        />
      ) : tours.length === 0 ? (
        <Empty description="Bạn chưa có tour yêu thích nào" image={Empty.PRESENTED_IMAGE_SIMPLE}>
          <Button type="primary">
            <Link to={PATHS.tour}>Khám phá tour</Link>
          </Button>
        </Empty>
      ) : (
        <Row gutter={[20, 20]} className="tour-grid">
          {tours.map((tour, index) => (
            <Col xs={24} md={12} xl={8} key={tour.id}>
              <TheTour tour={tour} imageIndex={index} viewMode="grid" />
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}