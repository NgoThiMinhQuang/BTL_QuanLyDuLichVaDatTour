import type { FeaturedTourApiItem } from '../types/home'

const API_BASE_URL = 'http://localhost:5297/api'

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

export async function getFeaturedTours(): Promise<FeaturedTourApiItem[]> {
  const response = await fetch(`${API_BASE_URL}/tour/get-all`)

  if (!response.ok) {
    throw new Error('Không thể tải danh sách tour nổi bật')
  }

  const data = (await response.json()) as RawFeaturedTour[]

  return data.slice(0, 6).map((item) => ({
    id: item.id,
    maTour: item.maTour,
    tenTour: item.tenTour,
    tenLoaiTour: item.tenLoaiTour,
    tenDiaDiemKhoiHanh: item.tenDiaDiemKhoiHanh,
    soNgay: item.soNgay,
    soDem: item.soDem,
    phuongTien: item.phuongTien ?? null,
    moTaNgan: item.moTaNgan ?? null,
    giaNguoiLonMacDinh: item.giaNguoiLonMacDinh ?? null,
    giaTreEmMacDinh: item.giaTreEmMacDinh ?? null,
    trangThai: item.trangThai,
  }))
}
