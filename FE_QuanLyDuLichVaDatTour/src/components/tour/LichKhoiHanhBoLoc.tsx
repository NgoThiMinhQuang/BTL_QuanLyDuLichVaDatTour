import { Input, Select } from 'antd'

interface LichKhoiHanhBoLocProps {
  keyword: string
  thangKhoiHanh: string
  diemDen: string
  destinationOptions: string[]
  onKeywordChange: (value: string) => void
  onThangKhoiHanhChange: (value: string) => void
  onDiemDenChange: (value: string) => void
}

const monthOptions = [
  { value: 'all', label: 'Tất cả tháng' },
  { value: '1', label: 'Tháng 1' },
  { value: '2', label: 'Tháng 2' },
  { value: '3', label: 'Tháng 3' },
  { value: '4', label: 'Tháng 4' },
  { value: '5', label: 'Tháng 5' },
  { value: '6', label: 'Tháng 6' },
  { value: '7', label: 'Tháng 7' },
  { value: '8', label: 'Tháng 8' },
  { value: '9', label: 'Tháng 9' },
  { value: '10', label: 'Tháng 10' },
  { value: '11', label: 'Tháng 11' },
  { value: '12', label: 'Tháng 12' },
]

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
            options={monthOptions}
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