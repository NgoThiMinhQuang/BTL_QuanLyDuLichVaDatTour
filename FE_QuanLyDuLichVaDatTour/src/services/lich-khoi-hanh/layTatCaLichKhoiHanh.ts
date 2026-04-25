import { resolveApiAssetUrl } from '../../constants/api'
import { layBangGiaLichKhoiHanh } from '../tour/layTourChiTiet'
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
  soChoDaDat?: number
  soChoConLai?: number
  trangThai: string
}

export interface LichKhoiHanhCardItem extends DepartureItem {
  tenLoaiTour: string
  tenDiaDiemKhoiHanh: string
  tenDiemDen: string
  khuVuc: string
  soNgay: number
  soDem: number
  phuongTien: string | null
  moTaNgan: string | null
  anhDaiDien: string | null
  giaNguoiLonMacDinh: number | null
  giaTreEmMacDinh: number | null
}

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
}

function resolveKhuVuc(tenDiemDen: string) {
  const normalized = normalizeText(tenDiemDen)

  if (['ha noi', 'ha long', 'ninh binh', 'sa pa'].some((keyword) => normalized.includes(keyword))) {
    return 'Miền Bắc'
  }

  if (['da nang', 'hue', 'hoi an', 'nha trang', 'da lat'].some((keyword) => normalized.includes(keyword))) {
    return 'Miền Trung'
  }

  if (['ho chi minh', 'phu quoc', 'can tho', 'chau doc', 'ha tien'].some((keyword) => normalized.includes(keyword))) {
    return 'Miền Nam'
  }

  return 'Việt Nam'
}

function getRemainingSeats(item: DepartureItem) {
  return Math.max(item.soChoConLai, 0)
}

function getCapacityLabel(item: DepartureItem) {
  const remainingSeats = getRemainingSeats(item)
  return `${remainingSeats} chỗ`
}

function getDescription(item: FeaturedTourApiItem) {
  if (item.moTaNgan?.trim()) {
    return item.moTaNgan.trim()
  }

  return `Hành trình ${item.tenTour.toLowerCase()} với lịch trình cân đối, phù hợp cho kỳ nghỉ sắp tới.`
}

function getTourDestinations(item: FeaturedTourApiItem) {
  return item.diemDens
    .slice()
    .sort((a, b) => a.thuTu - b.thuTu)
    .map((destination) => destination.tenDiaDiem)
}

function getCoverImage(item: FeaturedTourApiItem) {
  const coverImage = item.anhTours
    .slice()
    .sort((a, b) => Number(b.isAvatar) - Number(a.isAvatar) || a.thuTu - b.thuTu)
    .at(0)?.linkAnh

  return resolveApiAssetUrl(coverImage) ?? null
}

function getSeatBadgeLabel(item: DepartureItem) {
  const remainingSeats = getRemainingSeats(item)

  if (remainingSeats <= 0 || item.trangThai === 'het_cho') {
    return 'Hết chỗ'
  }

  if (remainingSeats <= 8) {
    return `Sắp hết chỗ`
  }

  return `Còn ${remainingSeats} chỗ`
}

function getSeatStatusClass(item: DepartureItem) {
  const remainingSeats = getRemainingSeats(item)
  return remainingSeats <= 0 || item.trangThai === 'het_cho' ? 'danger' : remainingSeats <= 8 ? 'warning' : 'success'
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
    soChoDaDat: item.soChoDaDat ?? Math.max(item.soChoToiDa - (item.soChoConLai ?? item.soChoToiDa), 0),
    soChoConLai: item.soChoConLai ?? item.soChoToiDa,
    trangThai: item.trangThai,
  }
}

async function mergeDepartureWithTour(departure: DepartureItem, toursById: Map<number, FeaturedTourApiItem>): Promise<LichKhoiHanhCardItem | null> {
  const tour = toursById.get(departure.tourId)

  if (!tour) {
    return null
  }

  const diemDens = getTourDestinations(tour)
  const tenDiemDen = diemDens.join(' - ') || tour.tenTour
  const pricing = await layBangGiaLichKhoiHanh(departure.id).catch(() => null)

  return {
    ...departure,
    tenLoaiTour: tour.tenLoaiTour,
    tenDiaDiemKhoiHanh: tour.tenDiaDiemKhoiHanh,
    tenDiemDen,
    khuVuc: resolveKhuVuc(tenDiemDen),
    soNgay: tour.soNgay,
    soDem: tour.soDem,
    phuongTien: tour.phuongTien,
    moTaNgan: getDescription(tour),
    anhDaiDien: getCoverImage(tour),
    giaNguoiLonMacDinh: pricing?.giaNguoiLonNgayThuong ?? tour.giaNguoiLonMacDinh,
    giaTreEmMacDinh: pricing?.giaTreEmNgayThuong ?? tour.giaTreEmMacDinh,
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

  const mergedItems = await Promise.all(
    departureGroups
      .flat()
      .map(mapDeparture)
      .map((departure) => mergeDepartureWithTour(departure, toursById)),
  )

  return mergedItems
    .filter((item): item is LichKhoiHanhCardItem => item !== null)
    .sort((a, b) => new Date(a.ngayKhoiHanh).getTime() - new Date(b.ngayKhoiHanh).getTime())
}