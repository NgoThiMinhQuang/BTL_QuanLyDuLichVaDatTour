import { API_BASE_URL } from '../../constants/api'
import { useAuthStore } from '../../store/authStore'
import type { AdminBookingItem, AdminTourItem, AdminTourStatus } from '../../types/admin'

function getAuthHeaders(contentType = false) {
  return {
    ...(contentType ? { 'Content-Type': 'application/json' } : {}),
    Authorization: `Bearer ${useAuthStore.getState().requireAccessToken()}`,
  }
}

async function handleApiResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const data = response.status === 204 ? null : await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage)
  }

  return data as T
}

export async function layDanhSachTourQuanTri(): Promise<AdminTourItem[]> {
  const response = await fetch(`${API_BASE_URL}/admin/tour/get-all`, {
    headers: getAuthHeaders(),
  })

  return handleApiResponse<AdminTourItem[]>(response, 'Không thể tải danh sách tour quản trị')
}

export async function capNhatTrangThaiTourQuanTri(id: number, trangThai: AdminTourStatus) {
  const response = await fetch(`${API_BASE_URL}/admin/tour/update-status/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(true),
    body: JSON.stringify({ trangThai }),
  })

  return handleApiResponse<void>(response, 'Không thể cập nhật trạng thái tour')
}

export async function anTourQuanTri(id: number) {
  const response = await fetch(`${API_BASE_URL}/admin/tour/hide/${id}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  })

  return handleApiResponse<void>(response, 'Không thể ẩn tour')
}

export async function layDanhSachBookingQuanTri(): Promise<AdminBookingItem[]> {
  const response = await fetch(`${API_BASE_URL}/admin/booking/get-all`, {
    headers: getAuthHeaders(),
  })

  return handleApiResponse<AdminBookingItem[]>(response, 'Không thể tải danh sách booking quản trị')
}
