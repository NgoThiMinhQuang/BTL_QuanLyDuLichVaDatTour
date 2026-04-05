import { layTourNoiBat } from '../tour/tour.api'
import { API_BASE_URL } from '../../constants/api'
import type { DepartureItem, FeaturedTourApiItem } from '../../types/tour'

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
  khuVuc: string
  soNgay: number
  soDem: number
  phuongTien: string | null
  moTaNgan: string | null
  giaNguoiLonMacDinh: number | null
  giaTreEmMacDinh: number | null
}

function resolveKhuVuc(tenDiaDiemKhoiHanh: string) {
  const normalized = tenDiaDiemKhoiHanh.toLowerCase()

  if (normalized.includes('hà nội') || normalized.includes('ha noi') || normalized.includes('hạ long') || normalized.includes('ha long')) {
    return 'Miền Bắc'
  }

  if (normalized.includes('đà nẵng') || normalized.includes('da nang') || normalized.includes('huế') || normalized.includes('hue') || normalized.includes('hội an') || normalized.includes('hoi an') || normalized.includes('nha trang')) {
    return 'Miền Trung'
  }

  if (normalized.includes('hồ chí minh') || normalized.includes('ho chi minh') || normalized.includes('cần thơ') || normalized.includes('can tho') || normalized.includes('phú quốc') || normalized.includes('phu quoc') || normalized.includes('châu đốc') || normalized.includes('chau doc') || normalized.includes('hà tiên') || normalized.includes('ha tien')) {
    return 'Miền Nam'
  }

  return 'Quốc tế'
}

function getChildPrice(adultPrice: number | null) {
  if (adultPrice === null) {
    return null
  }

  return Math.round(adultPrice * 0.8)
}

function getRemainingSeats(item: DepartureItem) {
  return Math.max(Math.round(item.soChoToiDa * 0.5), 5)
}

function getCapacityLabel(item: DepartureItem) {
  const remainingSeats = getRemainingSeats(item)
  return `${remainingSeats}/${item.soChoToiDa} chỗ`
}

function getDescription(item: FeaturedTourApiItem) {
  if (item.moTaNgan?.trim()) {
    return item.moTaNgan.trim()
  }

  return `Hành trình ${item.tenTour.toLowerCase()} với lịch trình cân đối, phù hợp cho kỳ nghỉ sắp tới.`
}

function getSeatBadgeLabel(item: DepartureItem) {
  const remainingSeats = getRemainingSeats(item)

  if (remainingSeats <= 8) {
    return `Sắp hết chỗ`
  }

  return `Còn ${remainingSeats} chỗ`
}

function getSeatStatusClass(item: DepartureItem) {
  const remainingSeats = getRemainingSeats(item)
  return remainingSeats <= 8 ? 'warning' : 'success'
}

export { getCapacityLabel, getDescription, getRemainingSeats, getSeatBadgeLabel, getSeatStatusClass }

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
    khuVuc: resolveKhuVuc(tour.tenDiaDiemKhoiHanh),
    soNgay: tour.soNgay,
    soDem: tour.soDem,
    phuongTien: tour.phuongTien,
    moTaNgan: getDescription(tour),
    giaNguoiLonMacDinh: tour.giaNguoiLonMacDinh,
    giaTreEmMacDinh: tour.giaTreEmMacDinh ?? getChildPrice(tour.giaNguoiLonMacDinh),
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