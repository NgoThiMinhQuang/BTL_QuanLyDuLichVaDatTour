import { useMemo, useState } from 'react'
import { TOUR_PAGE_SIZE } from '../../constant/tour'
import { useLoaiTour } from '../../services/tour/useLoaiTour'
import { filterTours } from '../../services/tour/filterTours'
import { sortTours } from '../../services/tour/sortTours'
import { useTourNoiBat } from '../../services/tour/useTourNoiBat'

export function useTourPage() {
  const { data: tours = [], isLoading: isLoadingTours, error: toursError, refetch: refetchTours } = useTourNoiBat(undefined)
  const { data: categories = [], isLoading: isLoadingCategories } = useLoaiTour()

  const [keyword, setKeyword] = useState('')
  const [diemDen, setDiemDen] = useState('all')
  const [giaRange, setGiaRange] = useState('all')
  const [thoiGian, setThoiGian] = useState('all')
  const [ngayKhoiHanh, setNgayKhoiHanh] = useState<string | null>(null)
  const [selectedLoaiTours, setSelectedLoaiTours] = useState<string[]>([])
  const [selectedPhuongTiens, setSelectedPhuongTiens] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('price-asc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)

  const destinationOptions = useMemo(
    () => Array.from(new Set(tours.map((tour) => tour.tenDiaDiemKhoiHanh))).sort((a, b) => a.localeCompare(b, 'vi')),
    [tours],
  )

  const filteredTours = useMemo(
    () => sortTours(
      filterTours(tours, {
        keyword,
        diemDen,
        giaRange,
        thoiGian,
        ngayKhoiHanh,
        selectedLoaiTours,
        selectedPhuongTiens,
      }),
      sortBy,
    ),
    [tours, keyword, diemDen, giaRange, thoiGian, ngayKhoiHanh, selectedLoaiTours, selectedPhuongTiens, sortBy],
  )

  const paginatedTours = useMemo(() => {
    const start = (page - 1) * TOUR_PAGE_SIZE
    return filteredTours.slice(start, start + TOUR_PAGE_SIZE)
  }, [filteredTours, page])

  const handleReset = () => {
    setKeyword('')
    setDiemDen('all')
    setGiaRange('all')
    setThoiGian('all')
    setNgayKhoiHanh(null)
    setSelectedLoaiTours([])
    setSelectedPhuongTiens([])
    setSortBy('price-asc')
    setViewMode('grid')
    setPage(1)
  }

  return {
    categories,
    destinationOptions,
    filteredTours,
    paginatedTours,
    isLoadingTours,
    isLoadingCategories,
    toursError,
    refetchTours,
    keyword,
    diemDen,
    giaRange,
    thoiGian,
    ngayKhoiHanh,
    selectedLoaiTours,
    selectedPhuongTiens,
    sortBy,
    viewMode,
    page,
    setKeyword,
    setDiemDen,
    setGiaRange,
    setThoiGian,
    setNgayKhoiHanh,
    setSelectedLoaiTours,
    setSelectedPhuongTiens,
    setSortBy,
    setViewMode,
    setPage,
    handleReset,
  }
}