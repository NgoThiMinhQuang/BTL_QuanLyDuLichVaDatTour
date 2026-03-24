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
  vaiTro: string
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
  vaiTro: string
  trangThai: string
}
