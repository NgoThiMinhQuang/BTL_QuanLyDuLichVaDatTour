import { Pagination } from 'antd'

interface TourPhanTrangProps {
  current: number
  pageSize: number
  total: number
  onChange: (page: number) => void
}

export function TourPhanTrang({ current, pageSize, total, onChange }: TourPhanTrangProps) {
  return (
    <div className="tour-pagination">
      <Pagination current={current} pageSize={pageSize} total={total} onChange={onChange} showSizeChanger={false} />
    </div>
  )
}
