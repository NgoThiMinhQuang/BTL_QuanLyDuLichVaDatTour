import './SchedulePage.css'
import { Alert, Empty, Skeleton, Space, Typography } from 'antd'
import bannerImage from '../assets/Banner.jpg'
import { BoLocLichKhoiHanh } from '../components/lich-khoi-hanh/BoLocLichKhoiHanh'
import { TheLichKhoiHanh } from '../components/lich-khoi-hanh/TheLichKhoiHanh'
import { TourPhanTrang } from '../components/common/TourPhanTrang'
import { SCHEDULE_PAGE_SIZE } from '../constants/schedule'
import { useLichKhoiHanhPage } from './useSchedulePage'

const { Paragraph, Title } = Typography

const heroBackgroundStyle = {
  backgroundImage: `url(${bannerImage})`,
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
  const scheduleItems = paginatedItems.map((item) => <TheLichKhoiHanh key={item.id} item={item} />)
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
            Khám phá các điểm đến tuyệt đẹp và chọn ngày khởi hành hoàn hảo cho chuyến hành trình của bạn. Hàng ngàn tour hấp dẫn đang chờ đón!
          </Paragraph>
        </div>
      </div>

      <div className="schedule-page-container">
        <BoLocLichKhoiHanh
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
