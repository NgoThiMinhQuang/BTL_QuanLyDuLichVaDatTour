import { useMemo, useState } from 'react'
import { TOUR_PAGE_SIZE } from '../../constant/tour'
import { useLoaiTour } from '../../services/tour/useLoaiTour'
import { sortTours } from '../../services/tour/sortTours'
import { useDiaDiem } from '../../services/tour/useDiaDiem'
import { useTourSearch } from '../../services/tour/useTourSearch'

function resolvePriceRange(giaRange: string) {
  if (giaRange === 'under-3m') {
    return { maxPrice: 2999999 }
  }

  if (giaRange === '3m-5m') {
    return { minPrice: 3000000, maxPrice: 5000000 }
  }

  if (giaRange === '5m-8m') {
    return { minPrice: 5000001, maxPrice: 8000000 }
  }

  if (giaRange === 'over-8m') {
    return { minPrice: 8000001 }
  }

  return {}
}

function resolveDurationRange(thoiGian: string) {
  if (thoiGian === 'short') {
    return { minSoNgay: 1, maxSoNgay: 2 }
  }

  if (thoiGian === 'medium') {
    return { minSoNgay: 3, maxSoNgay: 4 }
  }

  if (thoiGian === 'long') {
    return { minSoNgay: 5 }
  }

  return {}
}

function normalizeKeyword(keyword: string) {
  const trimmed = keyword.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function resolveSelectedLoaiTourIds(selectedLoaiTours: string[], categories: Array<{ id: number; ten: string }>) {
  if (selectedLoaiTours.length === 0) {
    return undefined
  }

  const ids = categories.filter((item) => selectedLoaiTours.includes(item.ten)).map((item) => item.id)
  return ids.length > 0 ? ids : undefined
}

function resolveSelectedDiemXuatPhatId(diemDen: string, diaDiems: Array<{ id: number; tenDiaDiem: string }>) {
  if (diemDen === 'all') {
    return undefined
  }

  return diaDiems.find((item) => item.tenDiaDiem === diemDen)?.id
}

function resolveSelectedPhuongTiens(selectedPhuongTiens: string[]) {
  return selectedPhuongTiens.length > 0 ? selectedPhuongTiens : undefined
}

function buildSearchParams(input: {
  keyword: string
  diemDen: string
  giaRange: string
  thoiGian: string
  selectedLoaiTours: string[]
  selectedPhuongTiens: string[]
  categories: Array<{ id: number; ten: string }>
  diaDiems: Array<{ id: number; tenDiaDiem: string }>
}) {
  return {
    keyword: normalizeKeyword(input.keyword),
    diemXuatPhatId: resolveSelectedDiemXuatPhatId(input.diemDen, input.diaDiems),
    loaiTourIds: resolveSelectedLoaiTourIds(input.selectedLoaiTours, input.categories),
    phuongTiens: resolveSelectedPhuongTiens(input.selectedPhuongTiens),
    ...resolvePriceRange(input.giaRange),
    ...resolveDurationRange(input.thoiGian),
  }
}

export function useTourPage() {
  const { data: categories = [], isLoading: isLoadingCategories } = useLoaiTour()
  const { data: diaDiems = [], isLoading: isLoadingDiaDiems } = useDiaDiem()

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

  const searchParams = useMemo(
    () => buildSearchParams({ keyword, diemDen, giaRange, thoiGian, selectedLoaiTours, selectedPhuongTiens, categories, diaDiems }),
    [keyword, diemDen, giaRange, thoiGian, selectedLoaiTours, selectedPhuongTiens, categories, diaDiems],
  )

  const { data: tours = [], isLoading: isLoadingTours, error: toursError, refetch: refetchTours } = useTourSearch(searchParams)

  const destinationOptions = useMemo(
    () => diaDiems.map((item) => item.tenDiaDiem).sort((a, b) => a.localeCompare(b, 'vi')),
    [diaDiems],
  )

  const filteredTours = useMemo(() => sortTours(tours, sortBy), [tours, sortBy])

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
    isLoadingDiaDiems,
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

export type UseTourPageReturn = ReturnType<typeof useTourPage>
