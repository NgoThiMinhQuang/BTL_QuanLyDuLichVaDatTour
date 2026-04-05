import { API_BASE_URL } from '../../constants/api'
import type { TinTucItem } from '../../types/tinTuc'

interface RawTinTucItem {
  id: number
  tieuDe: string
  slug: string
  tomTat?: string | null
  noiDung: string
  anhDaiDien?: string | null
  danhMuc?: string | null
  ngayDang: string
  trangThai: string
}

function mapTinTuc(item: RawTinTucItem): TinTucItem {
  return {
    id: item.id,
    tieuDe: item.tieuDe,
    slug: item.slug,
    tomTat: item.tomTat ?? null,
    noiDung: item.noiDung,
    anhDaiDien: item.anhDaiDien ?? null,
    danhMuc: item.danhMuc ?? null,
    ngayDang: item.ngayDang,
    trangThai: item.trangThai,
  }
}

export async function layTatCaTinTuc(): Promise<TinTucItem[]> {
  const response = await fetch(`${API_BASE_URL}/tin-tuc/get-all`)

  if (!response.ok) {
    throw new Error('Không thể tải danh sách tin tức')
  }

  const data = (await response.json()) as RawTinTucItem[]
  return data.map(mapTinTuc)
}
