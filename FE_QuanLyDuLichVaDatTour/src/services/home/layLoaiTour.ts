import { API_BASE_URL } from '../../constant/api'
import type { TourCategory } from '../../shared/home'

interface RawTourCategory {
  id: number
  ten: string
  moTa: string
  trangThai: string
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
