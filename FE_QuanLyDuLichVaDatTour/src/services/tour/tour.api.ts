import { API_BASE_URL } from '../../constants/api'
import type { DiaDiemItem, FeaturedTourApiItem, SearchTourParams, TourCategory } from '../../types/tour'

interface RawAnhTour {
  id: number
  linkAnh: string
  moTa?: string | null
  isAvatar: boolean
  thuTu: number
}

interface RawFeaturedTour {
  id: number
  maTour: string
  tenTour: string
  loaiTourId: number
  tenLoaiTour: string
  diemXuatPhatId: number
  tenDiemXuatPhat: string
  soNgay: number
  soDem: number
  phuongTien?: string | null
  moTaNgan?: string | null
  giaTuThamKhao?: number | null
  anhTours?: RawAnhTour[] | null
  trangThai: string
}

interface RawTourCategory {
  id: number
  ten: string
  moTa: string
  trangThai: string
}

interface RawDiaDiemItem {
  id: number
  tenDiaDiem: string
  tinhThanh?: string | null
  quocGia: string
  moTa?: string | null
  trangThai: string
}

function mapTour(item: RawFeaturedTour): FeaturedTourApiItem {
  return {
    id: item.id,
    maTour: item.maTour,
    tenTour: item.tenTour,
    loaiTourId: item.loaiTourId,
    tenLoaiTour: item.tenLoaiTour,
    diemXuatPhatId: item.diemXuatPhatId,
    tenDiaDiemKhoiHanh: item.tenDiemXuatPhat,
    soNgay: item.soNgay,
    soDem: item.soDem,
    phuongTien: item.phuongTien ?? null,
    moTaNgan: item.moTaNgan ?? null,
    giaNguoiLonMacDinh: item.giaTuThamKhao ?? null,
    giaTreEmMacDinh: null,
    anhTours: (item.anhTours ?? []).map((anh) => ({
      id: anh.id,
      linkAnh: anh.linkAnh,
      moTa: anh.moTa ?? null,
      isAvatar: anh.isAvatar,
      thuTu: anh.thuTu,
    })),
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

export async function layLoaiTour(): Promise<TourCategory[]> {
  const response = await fetch(`${API_BASE_URL}/loai-tour/get-all`)

  if (!response.ok) {
    throw new Error('Không thể tải danh mục tour')
  }

  const data = (await response.json()) as RawTourCategory[]
  return data.map((item) => ({
    id: item.id,
    ten: item.ten,
    moTa: item.moTa,
    trangThai: item.trangThai,
  }))
}

export async function layDiaDiem(): Promise<DiaDiemItem[]> {
  const response = await fetch(`${API_BASE_URL}/dia-diem/get-all`)

  if (!response.ok) {
    throw new Error('Không thể tải danh sách địa điểm')
  }

  const data = (await response.json()) as RawDiaDiemItem[]
  return data.map((item) => ({
    id: item.id,
    tenDiaDiem: item.tenDiaDiem,
    tinhThanh: item.tinhThanh ?? null,
    quocGia: item.quocGia,
    moTa: item.moTa ?? null,
    trangThai: item.trangThai,
  }))
}
