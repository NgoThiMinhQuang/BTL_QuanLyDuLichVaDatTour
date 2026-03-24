import { API_BASE_URL } from '../../constant/api'
import type { LoginRequest, LoginResponse } from './types'

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Đăng nhập thất bại')
  }

  return data as LoginResponse
}
