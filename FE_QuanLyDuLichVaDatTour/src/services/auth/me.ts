import { API_BASE_URL } from '../../constants/api'
import type { CurrentUserResponse } from './types'

const SESSION_EXPIRED_MESSAGE = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'

export async function getCurrentUser(accessToken: string): Promise<CurrentUserResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || SESSION_EXPIRED_MESSAGE)
  }

  return data as CurrentUserResponse
}
