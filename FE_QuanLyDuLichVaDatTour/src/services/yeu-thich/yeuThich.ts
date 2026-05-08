import { API_BASE_URL } from '../../constants/api'
import { useAuthStore } from '../../store/authStore'

export interface YeuThichItem {
  id: number
  tourId: number
  maTour: string
  tenTour: string
  tenLoaiTour: string
  soNgay: number
  soDem: number
  anhDaiDien?: string | null
  giaTuThamKhao: number
  trangThai: string
  createdAt: string
}

function getAuthHeaders(contentType = false) {
  const headers: Record<string, string> = {}
  try {
    headers['Authorization'] = `Bearer ${useAuthStore.getState().requireAccessToken()}`
  } catch {
    // token missing — handled below
  }
  if (contentType) {
    headers['Content-Type'] = 'application/json'
  }
  return headers
}

export async function layDanhSachYeuThich(): Promise<YeuThichItem[]> {
  const response = await fetch(`${API_BASE_URL}/yeu-thich`, {
    headers: getAuthHeaders(),
  })
  if (response.status === 401) {
    useAuthStore.getState().clearAuthSession()
    throw new Error('Phiên đăng nhập đã hết hạn.')
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message || 'Không thể tải danh sách yêu thích.')
  }
  return data as YeuThichItem[]
}

export async function themYeuThich(tourId: number): Promise<YeuThichItem> {
  const response = await fetch(`${API_BASE_URL}/yeu-thich/add`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: JSON.stringify({ tourId }),
  })
  if (response.status === 401) {
    useAuthStore.getState().clearAuthSession()
    throw new Error('Phiên đăng nhập đã hết hạn.')
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message || 'Không thể thêm vào yêu thích.')
  }
  return data as YeuThichItem
}

export async function xoaYeuThich(tourId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/yeu-thich/remove/${tourId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  })
  if (response.status === 401) {
    useAuthStore.getState().clearAuthSession()
    throw new Error('Phiên đăng nhập đã hết hạn.')
  }
  if (response.status === 204) {
    return
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message || 'Không thể xóa khỏi yêu thích.')
  }
}