import './TourThanhCongCu.css'
import { Segmented, Select, Typography } from 'antd'

const { Text } = Typography

interface TourThanhCongCuProps {
  sortBy: string
  viewMode: 'grid' | 'list'
  onSortChange: (value: string) => void
  onViewModeChange: (value: 'grid' | 'list') => void
}

export function TourThanhCongCu({ sortBy, viewMode, onSortChange, onViewModeChange }: TourThanhCongCuProps) {
  return (
    <div className="tour-toolbar">
      <div className="tour-toolbar-sort">
        <Text>Sắp xếp:</Text>
        <Select
          value={sortBy}
          className="tour-toolbar-select"
          onChange={onSortChange}
          options={[
            { value: 'price-asc', label: 'Giá tăng dần' },
            { value: 'price-desc', label: 'Giá giảm dần' },
            { value: 'name-asc', label: 'Tên A-Z' },
            { value: 'duration-asc', label: 'Thời lượng ngắn nhất' },
          ]}
        />
      </div>

      <Segmented
        value={viewMode}
        className="tour-toolbar-view"
        onChange={(value) => onViewModeChange(value as 'grid' | 'list')}
        options={[
          { label: '▦', value: 'grid' },
          { label: '☰', value: 'list' },
        ]}
      />
    </div>
  )
}
