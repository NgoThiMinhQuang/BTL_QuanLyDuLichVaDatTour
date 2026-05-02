import { API_BASE_URL } from '../../constants/api'
import { useAuthStore } from '../../store/authStore'
import type { CurrentUserResponse } from './types'

export interface UpdateProfilePayload {
  hoTen: string
  soDienThoai?: string
  diaChi?: string
  anhDaiDien?: string
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<CurrentUserResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/update-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${useAuthStore.getState().requireAccessToken()}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Cập nhật hồ sơ thất bại')
  }

  return data as CurrentUserResponse
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${useAuthStore.getState().requireAccessToken()}`,
    },
    body: JSON.stringify({
      oldPassword,
      newPassword,
    }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Đổi mật khẩu thất bại')
  }

  return data as { message: string }
}
