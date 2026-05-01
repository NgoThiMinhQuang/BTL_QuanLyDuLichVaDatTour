import './BoLocLichKhoiHanh.css'
import { Select } from 'antd'
import { SCHEDULE_MONTH_OPTIONS } from '../../constants/schedule'
import { SearchOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons'

interface BoLocLichKhoiHanhProps {
  keyword: string
  thangKhoiHanh: string
  diemDen: string
  destinationOptions: string[]
  onKeywordChange: (value: string) => void
  onThangKhoiHanhChange: (value: string) => void
  onDiemDenChange: (value: string) => void
}

export function BoLocLichKhoiHanh({
  keyword,
  thangKhoiHanh,
  diemDen,
  destinationOptions,
  onKeywordChange,
  onThangKhoiHanhChange,
  onDiemDenChange,
}: BoLocLichKhoiHanhProps) {
  return (
    <div className="schedule-filter-wrapper">
      <div className="schedule-filter-container">
        
        {/* Keyword Search */}
        <div className="filter-item filter-keyword">
          <div className="filter-item-icon">
            <SearchOutlined />
          </div>
          <div className="filter-item-content">
            <label>Tên tour</label>
            <input 
              type="text" 
              placeholder="Bạn muốn đi đâu?" 
              value={keyword}
              onChange={(e) => onKeywordChange(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-divider"></div>

        {/* Month Select */}
        <div className="filter-item filter-month">
          <div className="filter-item-icon">
            <CalendarOutlined />
          </div>
          <div className="filter-item-content">
            <label>Khởi hành</label>
            <Select
              variant="borderless"
              value={thangKhoiHanh}
              className="filter-select"
              classNames={{ popup: { root: 'filter-select-dropdown' } }}
              options={SCHEDULE_MONTH_OPTIONS}
              onChange={onThangKhoiHanhChange}
              suffixIcon={null}
            />
          </div>
        </div>

        <div className="filter-divider"></div>

        {/* Destination Select */}
        <div className="filter-item filter-destination">
          <div className="filter-item-icon">
            <EnvironmentOutlined />
          </div>
          <div className="filter-item-content">
            <label>Điểm đến</label>
            <Select
              variant="borderless"
              value={diemDen}
              className="filter-select"
              classNames={{ popup: { root: 'filter-select-dropdown' } }}
              options={[{ value: 'all', label: 'Tất cả điểm đến' }, ...destinationOptions.map((item) => ({ value: item, label: item }))]}
              onChange={onDiemDenChange}
              suffixIcon={null}
            />
          </div>
        </div>

        {/* Search Button (Visual only) */}
        <div className="filter-action">
          <button className="filter-search-btn">
            <SearchOutlined />
            <span>Tìm kiếm</span>
          </button>
        </div>

      </div>
    </div>
  )
}