import type { LichKhoiHanhCardItem } from './layTatCaLichKhoiHanh'

export interface LichKhoiHanhFilters {
  keyword: string
  thangKhoiHanh: string
  diemDen: string
}

export function filterLichKhoiHanh(items: LichKhoiHanhCardItem[], filters: LichKhoiHanhFilters) {
  const normalizedKeyword = filters.keyword.trim().toLowerCase()

  return items.filter((item) => {
    const departureMonth = new Date(item.ngayKhoiHanh).getMonth() + 1
    const matchesKeyword =
      !normalizedKeyword ||
      item.tenTour.toLowerCase().includes(normalizedKeyword) ||
      item.maTour.toLowerCase().includes(normalizedKeyword)
    const matchesMonth = filters.thangKhoiHanh === 'all' || departureMonth === Number(filters.thangKhoiHanh)
    const matchesDestination = filters.diemDen === 'all' || item.tenDiaDiemKhoiHanh === filters.diemDen

    return matchesKeyword && matchesMonth && matchesDestination
  })
}
