import './TourPage.css'
import { Alert, Col, Empty, Row, Skeleton, Typography } from 'antd'
import { BoLocTour } from '../components/tour/BoLocTour'
import { ThanhCongCuTour } from '../components/tour/ThanhCongCuTour'
import { TheTour } from '../components/tour/TheTour'
import { TourPhanTrang } from '../components/common/TourPhanTrang'
import { TOUR_PAGE_SIZE } from '../constants/tour'
import { useTourPage } from './useTourPage'

const { Paragraph, Title } = Typography

export default function Tour() {
  const {
    categories,
    destinationOptions,
    filteredTours,
    paginatedTours,
    isLoadingTours,
    isLoadingCategories,
    isLoadingDiaDiems,
    toursError,
    refetchTours,
    keyword,
    diemDen,
    giaRange,
    thoiGian,
    selectedLoaiTours,
    selectedPhuongTiens,
    sortBy,
    viewMode,
    page,
    setKeyword,
    setDiemDen,
    setGiaRange,
    setThoiGian,
    setSelectedLoaiTours,
    setSelectedPhuongTiens,
    setSortBy,
    setViewMode,
    setPage,
    handleReset,
  } = useTourPage()

  const pageSize = TOUR_PAGE_SIZE
  const isLoading = isLoadingTours || isLoadingCategories || isLoadingDiaDiems
  const shouldShowEmpty = !isLoadingTours && !toursError && filteredTours.length === 0
  const shouldShowResults = !isLoadingTours && !toursError && filteredTours.length > 0

  const handleKeywordChange = (value: string) => {
    setKeyword(value)
    setPage(1)
  }

  const handleDiemDenChange = (value: string) => {
    setDiemDen(value)
    setPage(1)
  }

  const handleGiaRangeChange = (value: string) => {
    setGiaRange(value)
    setPage(1)
  }

  const handleThoiGianChange = (value: string) => {
    setThoiGian(value)
    setPage(1)
  }

  const handleLoaiToursChange = (value: string[]) => {
    setSelectedLoaiTours(value)
    setPage(1)
  }

  const handlePhuongTiensChange = (value: string[]) => {
    setSelectedPhuongTiens(value)
    setPage(1)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setPage(1)
  }

  const retryAction = (
    <button type="button" className="tour-alert-retry" onClick={() => refetchTours()}>
      Thử lại
    </button>
  )

  return (
    <div className="tour-page">
      <div className="tour-page-header">
        <Title className="tour-page-title">Danh sách tour</Title>
        <Paragraph className="tour-results-count">Tìm thấy {filteredTours.length} tour phù hợp</Paragraph>
      </div>

      <div className="tour-layout">
        <aside className="tour-sidebar">
          <BoLocTour
            keyword={keyword}
            diemDen={diemDen}
            giaRange={giaRange}
            thoiGian={thoiGian}
            selectedLoaiTours={selectedLoaiTours}
            selectedPhuongTiens={selectedPhuongTiens}
            categories={categories}
            destinationOptions={destinationOptions}
            onKeywordChange={handleKeywordChange}
            onDiemDenChange={handleDiemDenChange}
            onGiaRangeChange={handleGiaRangeChange}
            onThoiGianChange={handleThoiGianChange}
            onLoaiToursChange={handleLoaiToursChange}
            onPhuongTiensChange={handlePhuongTiensChange}
            onReset={handleReset}
          />
        </aside>

        <section className="tour-content">
          <ThanhCongCuTour
            sortBy={sortBy}
            viewMode={viewMode}
            onSortChange={handleSortChange}
            onViewModeChange={setViewMode}
          />

          {isLoading ? (
            <Row gutter={[24, 24]} className="tour-grid">
              {Array.from({ length: pageSize }).map((_, index) => (
                <Col xs={24} md={12} key={index} className={viewMode === 'list' ? 'tour-grid-col-list' : ''}>
                  <div className="tour-card-skeleton">
                    <Skeleton active paragraph={{ rows: 8 }} />
                  </div>
                </Col>
              ))}
            </Row>
          ) : null}

          {!isLoadingTours && toursError ? (
            <Alert
              type="error"
              showIcon
              message="Không tải được danh sách tour"
              description="Vui lòng thử lại để tiếp tục xem các tour hiện có."
              action={retryAction}
            />
          ) : null}

          {shouldShowEmpty ? <Empty description="Không tìm thấy tour phù hợp" /> : null}

          {shouldShowResults ? (
            <>
              <Row gutter={[20, 20]} className={`tour-grid ${viewMode === 'list' ? 'tour-grid-list' : ''}`}>
                {paginatedTours.map((tour, index) => (
                  <Col
                    xs={24}
                    md={viewMode === 'list' ? 24 : 12}
                    xl={viewMode === 'list' ? 24 : 12}
                    key={tour.id}
                    className={viewMode === 'list' ? 'tour-grid-col-list' : ''}
                  >
                    <TheTour tour={tour} imageIndex={index} viewMode={viewMode} />
                  </Col>
                ))}
              </Row>

              <TourPhanTrang current={page} pageSize={pageSize} total={filteredTours.length} onChange={setPage} />
            </>
          ) : null}
        </section>
      </div>
    </div>
  )
}
