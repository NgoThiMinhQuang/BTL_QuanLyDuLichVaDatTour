import { API_BASE_URL } from '../../constants/api'
import { useAuthStore } from '../../store/authStore'

function getAuthHeaders(contentType = false) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${useAuthStore.getState().requireAccessToken()}`,
  }
  if (contentType) headers['Content-Type'] = 'application/json'
  return headers
}

export interface YeuCauHuyTourResponse {
  id: number
  bookingId: number
  maBooking: string
  tenTour: string
  lyDo: string
  trangThai: string
  ghiChuAdmin: string | null
  createdAt: string
  updatedAt: string | null
}

export interface AdminYeuCauHuyTourResponse {
  id: number
  bookingId: number
  maBooking: string
  tenTour: string
  hoTenKhachHang: string
  emailKhachHang: string
  lyDo: string
  trangThai: string
  ghiChuAdmin: string | null
  hoTenNguoiXuLy: string | null
  createdAt: string
  updatedAt: string | null
}

export async function taoYeuCauHuyTour(payload: { bookingId: number; lyDo: string }): Promise<YeuCauHuyTourResponse> {
  const response = await fetch(`${API_BASE_URL}/huy-tour/create`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload),
  })
  if (response.status === 401) {
    useAuthStore.getState().clearAuthSession()
    throw new Error('Phiên đăng nhập đã hết hạn.')
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new Error(data?.message || 'Không thể tạo yêu cầu hủy.')
  return data as YeuCauHuyTourResponse
}

export async function layYeuCauHuyTourCuaToi(): Promise<YeuCauHuyTourResponse[]> {
  const response = await fetch(`${API_BASE_URL}/huy-tour/my-requests`, {
    headers: getAuthHeaders(),
  })
  if (response.status === 401) {
    useAuthStore.getState().clearAuthSession()
    throw new Error('Phiên đăng nhập đã hết hạn.')
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new Error(data?.message || 'Không thể tải yêu cầu hủy.')
  return data as YeuCauHuyTourResponse[]
}

export async function layYeuCauHuyTourTheoBooking(bookingId: number): Promise<YeuCauHuyTourResponse | null> {
  const response = await fetch(`${API_BASE_URL}/huy-tour/by-booking/${bookingId}`, {
    headers: getAuthHeaders(),
  })
  if (response.status === 401) {
    useAuthStore.getState().clearAuthSession()
    throw new Error('Phiên đăng nhập đã hết hạn.')
  }
  if (response.status === 404) return null
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new Error(data?.message || 'Không thể tải yêu cầu hủy.')
  return data as YeuCauHuyTourResponse
}

// Admin
function getAdminHeaders(contentType = false) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${useAuthStore.getState().requireAccessToken()}`,
  }
  if (contentType) headers['Content-Type'] = 'application/json'
  return headers
}

export async function layYeuCauHuyTourChoDuyet(): Promise<AdminYeuCauHuyTourResponse[]> {
  const response = await fetch(`${API_BASE_URL}/admin/huy-tour/pending`, {
    headers: getAdminHeaders(),
  })
  if (response.status === 401) {
    useAuthStore.getState().clearAuthSession()
    throw new Error('Phiên đăng nhập đã hết hạn.')
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new Error(data?.message || 'Không thể tải danh sách.')
  return data as AdminYeuCauHuyTourResponse[]
}

export async function capNhatTrangThaiHuyTour(id: number, payload: { trangThai: string; ghiChuAdmin?: string }): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/huy-tour/update-status/${id}`, {
    method: 'PATCH',
    headers: getAdminHeaders(true),
    body: JSON.stringify(payload),
  })
  if (response.status === 401) {
    useAuthStore.getState().clearAuthSession()
    throw new Error('Phiên đăng nhập đã hết hạn.')
  }
  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.message || 'Không thể cập nhật trạng thái.')
  }
}