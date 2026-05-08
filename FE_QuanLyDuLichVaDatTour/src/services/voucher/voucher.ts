import { API_BASE_URL } from '../../constants/api'
import { useAuthStore } from '../../store/authStore'

export interface VoucherUserItem {
  id: number
  maVoucher: string
  tenVoucher: string
  kieuGiam: string
  giaTriGiam: number
  giamToiDa: number | null
  donHangToiThieu: number
  ngayBatDau: string
  ngayKetThuc: string
  moTa: string | null
  soLuongConLai: number
}

export interface VoucherHistoryItem {
  id: number
  maVoucher: string
  tenVoucher: string
  kieuGiam: string
  giaTriGiam: number
  maBooking: string
  bookingId: number
  ngayDat: string
  tongTien: number
  trangThaiBooking: string
}

function getAuthHeaders() {
  return {
    Authorization: `Bearer ${useAuthStore.getState().requireAccessToken()}`,
  }
}

export async function layVoucherKhaDung(): Promise<VoucherUserItem[]> {
  const response = await fetch(`${API_BASE_URL}/voucher/available`, {
    headers: getAuthHeaders(),
  })
  if (response.status === 401) {
    useAuthStore.getState().clearAuthSession()
    throw new Error('Phiên đăng nhập đã hết hạn.')
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message || 'Không thể tải danh sách voucher.')
  }
  return data as VoucherUserItem[]
}

export async function layLichSuVoucher(): Promise<VoucherHistoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/voucher/history`, {
    headers: getAuthHeaders(),
  })
  if (response.status === 401) {
    useAuthStore.getState().clearAuthSession()
    throw new Error('Phiên đăng nhập đã hết hạn.')
  }
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(data?.message || 'Không thể tải lịch sử voucher.')
  }
  return data as VoucherHistoryItem[]
}