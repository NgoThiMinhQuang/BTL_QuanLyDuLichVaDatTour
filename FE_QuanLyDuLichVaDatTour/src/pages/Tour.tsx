import { Alert, Col, Empty, Row, Skeleton, Space, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { TourBoLoc } from '../components/tour/TourBoLoc'
import { TourPhanTrang } from '../components/tour/TourPhanTrang'
import { TourThanhCongCu } from '../components/tour/TourThanhCongCu'
import { TourThe } from '../components/tour/TourThe'
import { useLoaiTour } from '../services/home/useLoaiTour'
import { useTourNoiBat } from '../services/home/useTourNoiBat'

const { Paragraph, Title } = Typography

const PAGE_SIZE = 6

export default function Tour() {
  const { data: tours = [], isLoading: isLoadingTours, error: toursError, refetch: refetchTours } = useTourNoiBat(undefined)
  const { data: categories = [], isLoading: isLoadingCategories } = useLoaiTour()

  const [keyword, setKeyword] = useState('')
  const [diemDen, setDiemDen] = useState('all')
  const [giaRange, setGiaRange] = useState('all')
  const [thoiGian, setThoiGian] = useState('all')
  const [ngayKhoiHanh, setNgayKhoiHanh] = useState<string | null>(null)
  const [selectedLoaiTours, setSelectedLoaiTours] = useState<string[]>([])
  const [selectedPhuongTiens, setSelectedPhuongTiens] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('price-asc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)

  const destinationOptions = useMemo(
    () => Array.from(new Set(tours.map((tour) => tour.tenDiaDiemKhoiHanh))).sort((a, b) => a.localeCompare(b, 'vi')),
    [tours],
  )

  const filteredTours = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    const result = tours.filter((tour) => {
      const matchesKeyword =
        !normalizedKeyword ||
        tour.tenTour.toLowerCase().includes(normalizedKeyword) ||
        tour.maTour.toLowerCase().includes(normalizedKeyword)

      const matchesDestination = diemDen === 'all' || tour.tenDiaDiemKhoiHanh === diemDen
      const matchesCategory = selectedLoaiTours.length === 0 || selectedLoaiTours.includes(tour.tenLoaiTour)
      const matchesTransport =
        selectedPhuongTiens.length === 0 ||
        (!!tour.phuongTien && selectedPhuongTiens.some((item) => tour.phuongTien?.toLowerCase().includes(item.toLowerCase())))

      const totalDays = tour.soNgay
      const matchesDuration =
        thoiGian === 'all' ||
        (thoiGian === 'short' && totalDays <= 2) ||
        (thoiGian === 'medium' && totalDays >= 3 && totalDays <= 4) ||
        (thoiGian === 'long' && totalDays >= 5)

      const price = tour.giaNguoiLonMacDinh ?? 0
      const matchesPrice =
        giaRange === 'all' ||
        (giaRange === 'under-3m' && price < 3000000) ||
        (giaRange === '3m-5m' && price >= 3000000 && price <= 5000000) ||
        (giaRange === '5m-8m' && price > 5000000 && price <= 8000000) ||
        (giaRange === 'over-8m' && price > 8000000)

      const matchesDate = !ngayKhoiHanh || true

      return matchesKeyword && matchesDestination && matchesCategory && matchesTransport && matchesDuration && matchesPrice && matchesDate
    })

    return [...result].sort((a, b) => {
      if (sortBy === 'price-asc') {
        return (a.giaNguoiLonMacDinh ?? 0) - (b.giaNguoiLonMacDinh ?? 0)
      }

      if (sortBy === 'price-desc') {
        return (b.giaNguoiLonMacDinh ?? 0) - (a.giaNguoiLonMacDinh ?? 0)
      }

      if (sortBy === 'name-asc') {
        return a.tenTour.localeCompare(b.tenTour, 'vi')
      }

      return a.soNgay - b.soNgay
    })
  }, [tours, keyword, diemDen, selectedLoaiTours, selectedPhuongTiens, thoiGian, giaRange, ngayKhoiHanh, sortBy])

  const paginatedTours = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredTours.slice(start, start + PAGE_SIZE)
  }, [filteredTours, page])

  const handleReset = () => {
    setKeyword('')
    setDiemDen('all')
    setGiaRange('all')
    setThoiGian('all')
    setNgayKhoiHanh(null)
    setSelectedLoaiTours([])
    setSelectedPhuongTiens([])
    setSortBy('price-asc')
    setViewMode('grid')
    setPage(1)
  }

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
            onKeywordChange={(value) => {
              setKeyword(value)
              setPage(1)
            }}
            onDiemDenChange={(value) => {
              setDiemDen(value)
              setPage(1)
            }}
            onGiaRangeChange={(value) => {
              setGiaRange(value)
              setPage(1)
            }}
            onThoiGianChange={(value) => {
              setThoiGian(value)
              setPage(1)
            }}
            onNgayKhoiHanhChange={(value) => {
              setNgayKhoiHanh(value)
              setPage(1)
            }}
            onLoaiToursChange={(value) => {
              setSelectedLoaiTours(value)
              setPage(1)
            }}
            onPhuongTiensChange={(value) => {
              setSelectedPhuongTiens(value)
              setPage(1)
            }}
            onReset={handleReset}
          />
        </aside>

        <section className="tour-content">
          <TourThanhCongCu
            sortBy={sortBy}
            viewMode={viewMode}
            onSortChange={(value) => {
              setSortBy(value)
              setPage(1)
            }}
            onViewModeChange={setViewMode}
          />

          {isLoadingTours || isLoadingCategories ? (
            <Row gutter={[24, 24]} className="tour-grid">
              {Array.from({ length: 6 }).map((_, index) => (
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
              action={<button type="button" className="tour-alert-retry" onClick={() => refetchTours()}>Thử lại</button>}
            />
          ) : null}

          {!isLoadingTours && !toursError && filteredTours.length === 0 ? <Empty description="Không tìm thấy tour phù hợp" /> : null}

          {!isLoadingTours && !toursError && filteredTours.length > 0 ? (
            <>
              <Row gutter={[24, 24]} className={`tour-grid ${viewMode === 'list' ? 'tour-grid-list' : ''}`}>
                {paginatedTours.map((tour, index) => (
                  <Col xs={24} md={viewMode === 'list' ? 24 : 12} key={tour.id} className={viewMode === 'list' ? 'tour-grid-col-list' : ''}>
                    <TourThe tour={tour} imageIndex={index} viewMode={viewMode} />
                  </Col>
                ))}
              </Row>

              <TourPhanTrang current={page} pageSize={PAGE_SIZE} total={filteredTours.length} onChange={setPage} />
            </>
          ) : null}
        </section>
      </div>
    </div>
  )
}
