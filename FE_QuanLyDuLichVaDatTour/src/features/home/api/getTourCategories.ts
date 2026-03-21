import type { TourCategory } from '../types/home'

const API_BASE_URL = 'http://localhost:5297/api'

interface RawTourCategory {
  id: number
  ten: string
  moTa: string
  trangThai: string
}

export async function getTourCategories(): Promise<TourCategory[]> {
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
