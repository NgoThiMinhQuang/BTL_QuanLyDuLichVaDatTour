import { Alert, Empty, Skeleton, Space, Typography } from 'antd'
import { useMemo, useState } from 'react'
import bannerImage from '../assets/Banner.jpg'
import { LichKhoiHanhBoLoc } from '../components/tour/LichKhoiHanhBoLoc'
import { TourPhanTrang } from '../components/tour/TourPhanTrang'
import { LichKhoiHanhThe } from '../components/tour/LichKhoiHanhThe'
import { useTatCaLichKhoiHanh } from '../services/home/useTatCaLichKhoiHanh'

const { Paragraph, Title } = Typography
const PAGE_SIZE = 4

const heroBackgroundStyle = {
  backgroundImage: `linear-gradient(180deg, rgba(8, 15, 37, 0.12), rgba(8, 15, 37, 0.36)), url(${bannerImage})`,
}

export default function LichKhoiHanh() {
  const { data = [], isLoading, error, refetch } = useTatCaLichKhoiHanh()

  const [keyword, setKeyword] = useState('')
  const [thangKhoiHanh, setThangKhoiHanh] = useState('all')
  const [diemDen, setDiemDen] = useState('all')
  const [page, setPage] = useState(1)

  const destinationOptions = useMemo(
    () => Array.from(new Set(data.map((item) => item.tenDiaDiemKhoiHanh))).sort((a, b) => a.localeCompare(b, 'vi')),
    [data],
  )

  const filteredItems = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    return data.filter((item) => {
      const departureMonth = new Date(item.ngayKhoiHanh).getMonth() + 1
      const matchesKeyword =
        !normalizedKeyword ||
        item.tenTour.toLowerCase().includes(normalizedKeyword) ||
        item.maTour.toLowerCase().includes(normalizedKeyword)
      const matchesMonth = thangKhoiHanh === 'all' || departureMonth === Number(thangKhoiHanh)
      const matchesDestination = diemDen === 'all' || item.tenDiaDiemKhoiHanh === diemDen

      return matchesKeyword && matchesMonth && matchesDestination
    })
  }, [data, keyword, thangKhoiHanh, diemDen])

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredItems.slice(start, start + PAGE_SIZE)
  }, [filteredItems, page])

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
          onKeywordChange={(value) => {
            setKeyword(value)
            setPage(1)
          }}
          onThangKhoiHanhChange={(value) => {
            setThangKhoiHanh(value)
            setPage(1)
          }}
          onDiemDenChange={(value) => {
            setDiemDen(value)
            setPage(1)
          }}
        />

        <div className="schedule-results">
          {isLoading ? (
            <Space direction="vertical" size={24} className="schedule-results-stack">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="schedule-card-skeleton">
                  <Skeleton active paragraph={{ rows: 6 }} />
                </div>
              ))}
            </Space>
          ) : null}

          {!isLoading && error ? (
            <Alert
              type="error"
              showIcon
              message="Không tải được lịch khởi hành"
              description="Vui lòng thử lại để tiếp tục xem các đợt khởi hành hiện có."
              action={<button type="button" className="tour-alert-retry" onClick={() => refetch()}>Thử lại</button>}
            />
          ) : null}

          {!isLoading && !error && filteredItems.length === 0 ? <Empty description="Không tìm thấy lịch khởi hành phù hợp" /> : null}

          {!isLoading && !error && filteredItems.length > 0 ? (
            <>
              <Space direction="vertical" size={24} className="schedule-results-stack">
                {paginatedItems.map((item) => (
                  <LichKhoiHanhThe key={item.id} item={item} />
                ))}
              </Space>

              <TourPhanTrang current={page} pageSize={PAGE_SIZE} total={filteredItems.length} onChange={setPage} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}