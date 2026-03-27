import type { FeaturedTourApiItem } from '../../libs/types/tour'

export interface TourFilters {
  keyword: string
  diemDen: string
  giaRange: string
  thoiGian: string
  ngayKhoiHanh: string | null
  selectedLoaiTours: string[]
  selectedPhuongTiens: string[]
}

export function filterTours(tours: FeaturedTourApiItem[], filters: TourFilters) {
  const normalizedKeyword = filters.keyword.trim().toLowerCase()

  return tours.filter((tour) => {
    const matchesKeyword =
      !normalizedKeyword ||
      tour.tenTour.toLowerCase().includes(normalizedKeyword) ||
      tour.maTour.toLowerCase().includes(normalizedKeyword)

    const matchesDestination = filters.diemDen === 'all' || tour.tenDiaDiemKhoiHanh === filters.diemDen
    const matchesCategory = filters.selectedLoaiTours.length === 0 || filters.selectedLoaiTours.includes(tour.tenLoaiTour)
    const matchesTransport =
      filters.selectedPhuongTiens.length === 0 ||
      (!!tour.phuongTien && filters.selectedPhuongTiens.some((item) => tour.phuongTien?.toLowerCase().includes(item.toLowerCase())))

    const totalDays = tour.soNgay
    const matchesDuration =
      filters.thoiGian === 'all' ||
      (filters.thoiGian === 'short' && totalDays <= 2) ||
      (filters.thoiGian === 'medium' && totalDays >= 3 && totalDays <= 4) ||
      (filters.thoiGian === 'long' && totalDays >= 5)

    const price = tour.giaNguoiLonMacDinh ?? 0
    const matchesPrice =
      filters.giaRange === 'all' ||
      (filters.giaRange === 'under-3m' && price < 3000000) ||
      (filters.giaRange === '3m-5m' && price >= 3000000 && price <= 5000000) ||
      (filters.giaRange === '5m-8m' && price > 5000000 && price <= 8000000) ||
      (filters.giaRange === 'over-8m' && price > 8000000)

    const matchesDate = !filters.ngayKhoiHanh || true

    return matchesKeyword && matchesDestination && matchesCategory && matchesTransport && matchesDuration && matchesPrice && matchesDate
  })
}
