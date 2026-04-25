import { API_BASE_URL } from '../../constants/api'
import type { CurrentUserResponse } from './types'

export async function getCurrentUser(accessToken: string): Promise<CurrentUserResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Phiên đăng nhập không hợp lệ')
  }

  return data as CurrentUserResponse
}
