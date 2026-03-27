import { API_BASE_URL } from '../../constant/api'
import type { DiaDiemItem } from '../../libs/types/tour'

interface RawDiaDiemItem {
  id: number
  tenDiaDiem: string
  tinhThanh?: string | null
  quocGia: string
  moTa?: string | null
  trangThai: string
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
