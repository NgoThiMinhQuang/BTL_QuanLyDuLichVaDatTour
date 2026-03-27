import { Input, Select } from 'antd'
import { SCHEDULE_MONTH_OPTIONS } from '../../constant/schedule'

interface LichKhoiHanhBoLocProps {
  keyword: string
  thangKhoiHanh: string
  diemDen: string
  destinationOptions: string[]
  onKeywordChange: (value: string) => void
  onThangKhoiHanhChange: (value: string) => void
  onDiemDenChange: (value: string) => void
}

export function LichKhoiHanhBoLoc({
  keyword,
  thangKhoiHanh,
  diemDen,
  destinationOptions,
  onKeywordChange,
  onThangKhoiHanhChange,
  onDiemDenChange,
}: LichKhoiHanhBoLocProps) {
  return (
    <div className="schedule-filter-card">
      <Input
        size="large"
        placeholder="Tìm kiếm tour..."
        className="schedule-search-input"
        value={keyword}
        onChange={(event) => onKeywordChange(event.target.value)}
      />

      <div className="schedule-filter-grid">
        <div className="schedule-filter-group">
          <label className="schedule-filter-label">Tháng khởi hành</label>
          <Select
            size="large"
            value={thangKhoiHanh}
            className="schedule-filter-select"
            options={SCHEDULE_MONTH_OPTIONS}
            onChange={onThangKhoiHanhChange}
          />
        </div>

        <div className="schedule-filter-group">
          <label className="schedule-filter-label">Điểm đến</label>
          <Select
            size="large"
            value={diemDen}
            className="schedule-filter-select"
            options={[{ value: 'all', label: 'Tất cả điểm đến' }, ...destinationOptions.map((item) => ({ value: item, label: item }))]}
            onChange={onDiemDenChange}
          />
        </div>
      </div>
    </div>
  )
}