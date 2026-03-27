import { API_BASE_URL } from '../../constant/api'
import type { FeaturedTourApiItem, SearchTourParams } from '../../libs/types/tour'

interface RawFeaturedTour {
  id: number
  maTour: string
  tenTour: string
  loaiTourId: number
  tenLoaiTour: string
  diaDiemKhoiHanhId: number
  tenDiaDiemKhoiHanh: string
  soNgay: number
  soDem: number
  phuongTien?: string | null
  moTaNgan?: string | null
  giaNguoiLonMacDinh?: number | null
  giaTreEmMacDinh?: number | null
  trangThai: string
}

function mapTour(item: RawFeaturedTour): FeaturedTourApiItem {
  return {
    id: item.id,
    maTour: item.maTour,
    tenTour: item.tenTour,
    loaiTourId: item.loaiTourId,
    tenLoaiTour: item.tenLoaiTour,
    diemXuatPhatId: item.diaDiemKhoiHanhId,
    tenDiaDiemKhoiHanh: item.tenDiaDiemKhoiHanh,
    soNgay: item.soNgay,
    soDem: item.soDem,
    phuongTien: item.phuongTien ?? null,
    moTaNgan: item.moTaNgan ?? null,
    giaNguoiLonMacDinh: item.giaNguoiLonMacDinh ?? null,
    giaTreEmMacDinh: item.giaTreEmMacDinh ?? null,
    trangThai: item.trangThai,
  }
}

function appendListParams(searchParams: URLSearchParams, key: string, values?: Array<string | number>) {
  values?.forEach((value) => searchParams.append(key, String(value)))
}

export async function layTourNoiBat(limit?: number): Promise<FeaturedTourApiItem[]> {
  const response = await fetch(`${API_BASE_URL}/tour/get-all`)

  if (!response.ok) {
    throw new Error('Không thể tải danh sách tour nổi bật')
  }

  const data = (await response.json()) as RawFeaturedTour[]
  const mapped = data.map(mapTour)

  return typeof limit === 'number' ? mapped.slice(0, limit) : mapped
}

export async function timTours(params: SearchTourParams): Promise<FeaturedTourApiItem[]> {
  const searchParams = new URLSearchParams()

  if (params.keyword?.trim()) {
    searchParams.set('keyword', params.keyword.trim())
  }

  if (params.diemXuatPhatId) {
    searchParams.set('diemXuatPhatId', String(params.diemXuatPhatId))
  }

  appendListParams(searchParams, 'loaiTourIds', params.loaiTourIds)
  appendListParams(searchParams, 'phuongTiens', params.phuongTiens)

  if (typeof params.minPrice === 'number') {
    searchParams.set('minPrice', String(params.minPrice))
  }

  if (typeof params.maxPrice === 'number') {
    searchParams.set('maxPrice', String(params.maxPrice))
  }

  if (typeof params.minSoNgay === 'number') {
    searchParams.set('minSoNgay', String(params.minSoNgay))
  }

  if (typeof params.maxSoNgay === 'number') {
    searchParams.set('maxSoNgay', String(params.maxSoNgay))
  }

  const response = await fetch(`${API_BASE_URL}/tour/search?${searchParams.toString()}`)

  if (!response.ok) {
    throw new Error('Không thể tìm kiếm danh sách tour')
  }

  const data = (await response.json()) as RawFeaturedTour[]
  return data.map(mapTour)
}
