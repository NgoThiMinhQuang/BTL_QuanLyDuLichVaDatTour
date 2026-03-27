import './Tour.css'
import { Alert, Col, Empty, Row, Skeleton, Typography } from 'antd'
import { TourBoLoc } from '../../components/tour/TourBoLoc'
import { TourThanhCongCu } from '../../components/tour/TourThanhCongCu'
import { TourThe } from '../../components/tour/TourThe'
import { TourPhanTrang } from '../../common/components/TourPhanTrang'
import { TOUR_PAGE_SIZE } from '../../constant/tour'
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
    toursError,
    refetchTours,
    keyword,
    diemDen,
    giaRange,
    thoiGian,
    ngayKhoiHanh,
    selectedLoaiTours,
    selectedPhuongTiens,
    sortBy,
    viewMode,
    page,
    setKeyword,
    setDiemDen,
    setGiaRange,
    setThoiGian,
    setNgayKhoiHanh,
    setSelectedLoaiTours,
    setSelectedPhuongTiens,
    setSortBy,
    setViewMode,
    setPage,
    handleReset,
  } = useTourPage()

  const pageSize = TOUR_PAGE_SIZE
  const isLoading = isLoadingTours || isLoadingCategories
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

  const handleNgayKhoiHanhChange = (value: string | null) => {
    setNgayKhoiHanh(value)
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
          <TourBoLoc
            keyword={keyword}
            diemDen={diemDen}
            giaRange={giaRange}
            thoiGian={thoiGian}
            ngayKhoiHanh={ngayKhoiHanh}
            selectedLoaiTours={selectedLoaiTours}
            selectedPhuongTiens={selectedPhuongTiens}
            categories={categories}
            destinationOptions={destinationOptions}
            onKeywordChange={handleKeywordChange}
            onDiemDenChange={handleDiemDenChange}
            onGiaRangeChange={handleGiaRangeChange}
            onThoiGianChange={handleThoiGianChange}
            onNgayKhoiHanhChange={handleNgayKhoiHanhChange}
            onLoaiToursChange={handleLoaiToursChange}
            onPhuongTiensChange={handlePhuongTiensChange}
            onReset={handleReset}
          />
        </aside>

        <section className="tour-content">
          <TourThanhCongCu
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
              <Row gutter={[24, 24]} className={`tour-grid ${viewMode === 'list' ? 'tour-grid-list' : ''}`}>
                {paginatedTours.map((tour, index) => (
                  <Col xs={24} md={viewMode === 'list' ? 24 : 12} key={tour.id} className={viewMode === 'list' ? 'tour-grid-col-list' : ''}>
                    <TourThe tour={tour} imageIndex={index} viewMode={viewMode} />
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
