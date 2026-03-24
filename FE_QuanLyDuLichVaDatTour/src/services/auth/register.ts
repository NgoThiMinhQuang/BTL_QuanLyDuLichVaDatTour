import { API_BASE_URL } from '../../constant/api'
import type { RegisterRequest, RegisterResponse } from './types'

export async function register(payload: RegisterRequest): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Đăng ký thất bại')
  }

  return data as RegisterResponse
}
