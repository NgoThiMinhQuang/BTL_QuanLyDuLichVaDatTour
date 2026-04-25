export type VaiTroNguoiDung = 'admin' | 'khach_hang'

export interface LoginRequest {
  email: string
  matKhau: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  id: number
  email: string
  hoTen: string
  vaiTro: VaiTroNguoiDung
  trangThai: string
}

export interface RegisterRequest {
  email: string
  matKhau: string
  hoTen: string
  soDienThoai?: string
  diaChi?: string
  anhDaiDien?: string
}

export interface RegisterResponse {
  id: number
  email: string
  hoTen: string
  vaiTro: VaiTroNguoiDung
  trangThai: string
}

export interface CurrentUserResponse {
  id: number
  email: string
  hoTen: string
  soDienThoai?: string | null
  diaChi?: string | null
  anhDaiDien?: string | null
  vaiTro: VaiTroNguoiDung
  trangThai: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
  resetToken?: string | null
  resetLink?: string | null
  expiresAt?: string | null
}

export interface ResetPasswordRequest {
  token: string
  matKhauMoi: string
}
