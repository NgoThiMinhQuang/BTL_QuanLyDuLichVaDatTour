import { API_BASE_URL } from '../../constants/api'
import type { ResetPasswordRequest } from './types'

export async function resetPassword(payload: ResetPasswordRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Không thể đặt lại mật khẩu')
  }
}
