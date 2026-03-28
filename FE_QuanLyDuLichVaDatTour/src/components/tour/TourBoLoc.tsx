import { Button, Checkbox, Input, Select, Space, Typography } from 'antd'
import type { TourCategory } from '../../libs/types/tour'

const { Title } = Typography

interface TourBoLocProps {
  keyword: string
  diemDen: string
  giaRange: string
  thoiGian: string
  selectedLoaiTours: string[]
  selectedPhuongTiens: string[]
  categories: TourCategory[]
  destinationOptions: string[]
  onKeywordChange: (value: string) => void
  onDiemDenChange: (value: string) => void
  onGiaRangeChange: (value: string) => void
  onThoiGianChange: (value: string) => void
  onLoaiToursChange: (value: string[]) => void
  onPhuongTiensChange: (value: string[]) => void
  onReset: () => void
}

const phuongTienOptions = ['Xe du lịch', 'Máy bay', 'Tàu hỏa', 'Du thuyền']

export function TourBoLoc(props: TourBoLocProps) {
  const {
    keyword,
    diemDen,
    giaRange,
    thoiGian,
    selectedLoaiTours,
    selectedPhuongTiens,
    categories,
    destinationOptions,
    onKeywordChange,
    onDiemDenChange,
    onGiaRangeChange,
    onThoiGianChange,
    onLoaiToursChange,
    onPhuongTiensChange,
    onReset,
  } = props

  return (
    <div className="tour-filter-card">
      <div className="tour-filter-header">
        <Title level={3} className="tour-filter-title">
          Bộ lọc
        </Title>
        <button type="button" className="tour-filter-reset" onClick={onReset}>
          Xóa bộ lọc
        </button>
      </div>

      <Space direction="vertical" size={24} className="tour-filter-sections">
        <div className="tour-filter-group">
          <label className="tour-filter-label">Tìm kiếm</label>
          <Input
            size="large"
            placeholder="Tên tour..."
            className="tour-filter-input"
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
          />
        </div>

        <div className="tour-filter-group">
          <label className="tour-filter-label">Điểm khởi hành</label>
          <Select
            size="large"
            value={diemDen}
            className="tour-filter-select"
            options={[{ value: 'all', label: 'Tất cả' }, ...destinationOptions.map((item) => ({ value: item, label: item }))]}
            onChange={onDiemDenChange}
          />
        </div>

        <div className="tour-filter-group">
          <label className="tour-filter-label">Loại tour</label>
          <Checkbox.Group
            className="tour-filter-checkbox-group"
            value={selectedLoaiTours}
            onChange={(values) => onLoaiToursChange(values as string[])}
          >
            <Space direction="vertical" size={12}>
              {categories.map((item) => (
                <Checkbox key={item.id} value={item.ten}>
                  {item.ten}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </div>

        <div className="tour-filter-group">
          <label className="tour-filter-label">Khoảng giá</label>
          <Select
            size="large"
            value={giaRange}
            className="tour-filter-select"
            onChange={onGiaRangeChange}
            options={[
              { value: 'all', label: 'Tất cả' },
              { value: 'under-3m', label: 'Dưới 3 triệu' },
              { value: '3m-5m', label: '3 - 5 triệu' },
              { value: '5m-8m', label: '5 - 8 triệu' },
              { value: 'over-8m', label: 'Trên 8 triệu' },
            ]}
          />
        </div>

        <div className="tour-filter-group">
          <label className="tour-filter-label">Thời gian</label>
          <Select
            size="large"
            value={thoiGian}
            className="tour-filter-select"
            onChange={onThoiGianChange}
            options={[
              { value: 'all', label: 'Tất cả' },
              { value: 'short', label: '1 - 2 ngày' },
              { value: 'medium', label: '3 - 4 ngày' },
              { value: 'long', label: 'Từ 5 ngày' },
            ]}
          />
        </div>

        <div className="tour-filter-group">
          <label className="tour-filter-label">Phương tiện</label>
          <Checkbox.Group
            className="tour-filter-checkbox-group"
            value={selectedPhuongTiens}
            onChange={(values) => onPhuongTiensChange(values as string[])}
          >
            <Space direction="vertical" size={12}>
              {phuongTienOptions.map((item) => (
                <Checkbox key={item} value={item}>
                  {item}
                </Checkbox>
              ))}
            </Space>
          </Checkbox.Group>
        </div>


        <Button type="primary" size="large" className="tour-filter-apply-button">
          Áp dụng bộ lọc
        </Button>
      </Space>
    </div>
  )
}
