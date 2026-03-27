import type { FeaturedTourApiItem } from '../../libs/types/tour'

export function sortTours(tours: FeaturedTourApiItem[], sortBy: string) {
  return [...tours].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return (a.giaNguoiLonMacDinh ?? 0) - (b.giaNguoiLonMacDinh ?? 0)
    }

    if (sortBy === 'price-desc') {
      return (b.giaNguoiLonMacDinh ?? 0) - (a.giaNguoiLonMacDinh ?? 0)
    }

    if (sortBy === 'name-asc') {
      return a.tenTour.localeCompare(b.tenTour, 'vi')
    }

    return a.soNgay - b.soNgay
  })
}
