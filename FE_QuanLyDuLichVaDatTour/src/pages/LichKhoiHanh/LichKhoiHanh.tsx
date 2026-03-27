import './LichKhoiHanh.css'
import { Alert, Empty, Skeleton, Space, Typography } from 'antd'
import bannerImage from '../../assets/Banner.jpg'
import { LichKhoiHanhBoLoc } from '../../components/lich-khoi-hanh/LichKhoiHanhBoLoc'
import { LichKhoiHanhThe } from '../../components/lich-khoi-hanh/LichKhoiHanhThe'
import { TourPhanTrang } from '../../common/components/TourPhanTrang'
import { SCHEDULE_PAGE_SIZE } from '../../constant/schedule'
import { useLichKhoiHanhPage } from './useLichKhoiHanhPage'

const { Paragraph, Title } = Typography

const heroBackgroundStyle = {
  backgroundImage: `linear-gradient(180deg, rgba(8, 15, 37, 0.12), rgba(8, 15, 37, 0.36)), url(${bannerImage})`,
}

export default function LichKhoiHanh() {
  const {
    keyword,
    thangKhoiHanh,
    diemDen,
    page,
    setKeyword,
    setThangKhoiHanh,
    setDiemDen,
    setPage,
    destinationOptions,
    filteredItems,
    paginatedItems,
    isLoading,
    error,
    refetch,
  } = useLichKhoiHanhPage()

  const handleKeywordChange = (value: string) => {
    setKeyword(value)
    setPage(1)
  }

  const handleThangKhoiHanhChange = (value: string) => {
    setThangKhoiHanh(value)
    setPage(1)
  }

  const handleDiemDenChange = (value: string) => {
    setDiemDen(value)
    setPage(1)
  }

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage)
  }

  const shouldShowEmpty = !isLoading && !error && filteredItems.length === 0
  const shouldShowResults = !isLoading && !error && filteredItems.length > 0
  const scheduleItems = paginatedItems.map((item) => <LichKhoiHanhThe key={item.id} item={item} />)
  const scheduleSkeletons = Array.from({ length: 3 }).map((_, index) => (
    <div key={index} className="schedule-card-skeleton">
      <Skeleton active paragraph={{ rows: 6 }} />
    </div>
  ))

  return (
    <div className="schedule-page">
      <div className="schedule-hero" style={heroBackgroundStyle}>
        <div className="schedule-hero-overlay" />
        <div className="schedule-hero-content">
          <Title className="schedule-hero-title">Lịch khởi hành</Title>
          <Paragraph className="schedule-hero-description">
            Chọn ngày khởi hành phù hợp cho chuyến du lịch của bạn
          </Paragraph>
        </div>
      </div>

      <div className="schedule-page-container">
        <LichKhoiHanhBoLoc
          keyword={keyword}
          thangKhoiHanh={thangKhoiHanh}
          diemDen={diemDen}
          destinationOptions={destinationOptions}
          onKeywordChange={handleKeywordChange}
          onThangKhoiHanhChange={handleThangKhoiHanhChange}
          onDiemDenChange={handleDiemDenChange}
        />

        <div className="schedule-results">
          {isLoading ? <Space direction="vertical" size={24} className="schedule-results-stack">{scheduleSkeletons}</Space> : null}

          {!isLoading && error ? (
            <Alert
              type="error"
              showIcon
              message="Không tải được lịch khởi hành"
              description="Vui lòng thử lại để tiếp tục xem các đợt khởi hành hiện có."
              action={<button type="button" className="tour-alert-retry" onClick={() => refetch()}>Thử lại</button>}
            />
          ) : null}

          {shouldShowEmpty ? <Empty description="Không tìm thấy lịch khởi hành phù hợp" /> : null}

          {shouldShowResults ? (
            <>
              <Space direction="vertical" size={24} className="schedule-results-stack">
                {scheduleItems}
              </Space>

              <TourPhanTrang current={page} pageSize={SCHEDULE_PAGE_SIZE} total={filteredItems.length} onChange={handlePageChange} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
