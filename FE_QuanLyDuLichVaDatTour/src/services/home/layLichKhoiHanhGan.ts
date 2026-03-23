import { API_BASE_URL } from '../../constant/api'
import type { DepartureItem, FeaturedTourApiItem } from '../../shared/home'

interface RawDeparture {
  id: number
  tourId: number
  maTour: string
  tenTour: string
  maDotTour: string
  ngayKhoiHanh: string
  ngayKetThuc: string
  noiTapTrung?: string | null
  soChoToiDa: number
  trangThai: string
}

export async function layLichKhoiHanhGan(tours: FeaturedTourApiItem[]): Promise<DepartureItem[]> {
  const uniqueTours = tours.slice(0, 4)

  const departureGroups = await Promise.all(
    uniqueTours.map(async (tour) => {
      const response = await fetch(`${API_BASE_URL}/lich-khoi-hanh/get-by-tour/${tour.id}`)

      if (!response.ok) {
        return [] as RawDeparture[]
      }

      const data = (await response.json()) as RawDeparture[]
      return data
    }),
  )

  return departureGroups
    .flat()
    .sort((a, b) => new Date(a.ngayKhoiHanh).getTime() - new Date(b.ngayKhoiHanh).getTime())
    .slice(0, 4)
    .map((item) => ({
      id: item.id,
      tourId: item.tourId,
      maTour: item.maTour,
      tenTour: item.tenTour,
      maDotTour: item.maDotTour,
      ngayKhoiHanh: item.ngayKhoiHanh,
      ngayKetThuc: item.ngayKetThuc,
      noiTapTrung: item.noiTapTrung ?? null,
      soChoToiDa: item.soChoToiDa,
      trangThai: item.trangThai,
    }))
}
