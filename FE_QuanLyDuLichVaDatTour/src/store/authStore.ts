import { create } from 'zustand'
import type { VaiTroNguoiDung } from '../services/auth/types'

export interface NguoiDungDangNhap {
  id: number
  email: string
  hoTen: string
  vaiTro: VaiTroNguoiDung
  trangThai: string
}

interface AuthState {
  accessToken: string | null
  currentUser: NguoiDungDangNhap | null
  setAuthSession: (accessToken: string, user: NguoiDungDangNhap) => void
  clearAuthSession: () => void
  requireAccessToken: () => string
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  currentUser: null,
  setAuthSession: (accessToken, user) => set({ accessToken, currentUser: user }),
  clearAuthSession: () => set({ accessToken: null, currentUser: null }),
  requireAccessToken: () => {
    const accessToken = get().accessToken

    if (!accessToken) {
      throw new Error('Vui lòng đăng nhập để tiếp tục')
    }

    return accessToken
  },
}))
