import { useMemo, useState } from 'react'
import { SCHEDULE_PAGE_SIZE } from '../../constant/schedule'
import { filterLichKhoiHanh } from '../../services/lich-khoi-hanh/filterLichKhoiHanh'
import { useTatCaLichKhoiHanh } from '../../services/lich-khoi-hanh/useTatCaLichKhoiHanh'

export function useLichKhoiHanhPage() {
  const { data = [], isLoading, error, refetch } = useTatCaLichKhoiHanh()

  const [keyword, setKeyword] = useState('')
  const [thangKhoiHanh, setThangKhoiHanh] = useState('all')
  const [diemDen, setDiemDen] = useState('all')
  const [page, setPage] = useState(1)

  const destinationOptions = useMemo(
    () => Array.from(new Set(data.map((item) => item.tenDiaDiemKhoiHanh))).sort((a, b) => a.localeCompare(b, 'vi')),
    [data],
  )

  const filteredItems = useMemo(
    () => filterLichKhoiHanh(data, { keyword, thangKhoiHanh, diemDen }),
    [data, keyword, thangKhoiHanh, diemDen],
  )

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * SCHEDULE_PAGE_SIZE
    return filteredItems.slice(start, start + SCHEDULE_PAGE_SIZE)
  }, [filteredItems, page])

  return {
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
  }
}