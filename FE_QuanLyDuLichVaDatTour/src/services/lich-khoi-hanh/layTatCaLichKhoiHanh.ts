import { layTourNoiBat } from '../tour/layTourNoiBat'
import { API_BASE_URL } from '../../constant/api'
import type { DepartureItem, FeaturedTourApiItem } from '../../libs/types/tour'

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

export interface LichKhoiHanhCardItem extends DepartureItem {
  tenLoaiTour: string
  tenDiaDiemKhoiHanh: string
  soNgay: number
  soDem: number
  phuongTien: string | null
  moTaNgan: string | null
  giaNguoiLonMacDinh: number | null
  giaTreEmMacDinh: number | null
}

function mapDeparture(item: RawDeparture): DepartureItem {
  return {
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
  }
}

function mergeDepartureWithTour(departure: DepartureItem, toursById: Map<number, FeaturedTourApiItem>): LichKhoiHanhCardItem | null {
  const tour = toursById.get(departure.tourId)

  if (!tour) {
    return null
  }

  return {
    ...departure,
    tenLoaiTour: tour.tenLoaiTour,
    tenDiaDiemKhoiHanh: tour.tenDiaDiemKhoiHanh,
    soNgay: tour.soNgay,
    soDem: tour.soDem,
    phuongTien: tour.phuongTien,
    moTaNgan: tour.moTaNgan,
    giaNguoiLonMacDinh: tour.giaNguoiLonMacDinh,
    giaTreEmMacDinh: tour.giaTreEmMacDinh,
  }
}

export async function layTatCaLichKhoiHanh(): Promise<LichKhoiHanhCardItem[]> {
  const tours = await layTourNoiBat(undefined)
  const toursById = new Map(tours.map((tour) => [tour.id, tour]))

  const departureGroups = await Promise.all(
    tours.map(async (tour) => {
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
    .map(mapDeparture)
    .map((departure) => mergeDepartureWithTour(departure, toursById))
    .filter((item): item is LichKhoiHanhCardItem => item !== null)
    .sort((a, b) => new Date(a.ngayKhoiHanh).getTime() - new Date(b.ngayKhoiHanh).getTime())
}