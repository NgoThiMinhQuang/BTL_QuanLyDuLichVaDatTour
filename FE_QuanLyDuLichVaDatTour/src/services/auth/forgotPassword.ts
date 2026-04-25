import { API_BASE_URL } from '../../constants/api'
import type { ForgotPasswordRequest, ForgotPasswordResponse } from './types'

export async function forgotPassword(payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Không thể tạo liên kết đặt lại mật khẩu')
  }

  return data as ForgotPasswordResponse
}
