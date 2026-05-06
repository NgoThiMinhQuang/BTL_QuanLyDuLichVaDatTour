import { API_BASE_URL } from '../../constants/api'
import { SESSION_EXPIRED_MESSAGE, useAuthStore } from '../../store/authStore'

export interface ReviewItem {
  id: number
  bookingId: number
  tourId: number
  maBooking: string
  tenTour: string
  ngayKhoiHanh: string
  ngayKetThuc: string
  soSao: number
  noiDung: string
  createdAt: string
  updatedAt: string
}

export interface CreateReviewPayload {
  bookingId: number
  soSao: number
  noiDung: string
}

export interface TourReviewItem {
  id: number
  tourId: number
  hoTenKhachHang: string
  anhDaiDien?: string | null
  tenTour: string
  soSao: number
  noiDung: string
  phanHoiAdmin?: string | null
  ngayDanhGia: string
}

export interface TourReviewSummary {
  averageRating: number
  totalReviews: number
  fiveStar: number
  fourStar: number
  threeStar: number
  twoStar: number
  oneStar: number
}

export async function layDanhGiaDaDuyetTheoTour(tourId: number): Promise<TourReviewItem[]> {
  const response = await fetch(`${API_BASE_URL}/review/tour/${tourId}`)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Không thể tải đánh giá tour')
  }

  return data as TourReviewItem[]
}

export async function layDanhGiaNoiBat(limit = 3): Promise<TourReviewItem[]> {
  const response = await fetch(`${API_BASE_URL}/review/featured?limit=${limit}`)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Không thể tải đánh giá nổi bật')
  }

  return data as TourReviewItem[]
}

export async function layThongKeDanhGiaTour(tourId: number): Promise<TourReviewSummary> {
  const response = await fetch(`${API_BASE_URL}/review/tour/${tourId}/summary`)
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Không thể tải thống kê đánh giá tour')
  }

  return data as TourReviewSummary
}

export async function layDanhGiaCuaToi(): Promise<ReviewItem[]> {
  const response = await fetch(`${API_BASE_URL}/review/my-reviews`, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().requireAccessToken()}`,
    },
  })

  if (response.status === 401) {
    useAuthStore.getState().clearAuthSession()
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(response.status === 401 ? SESSION_EXPIRED_MESSAGE : data?.message || 'Không thể tải danh sách đánh giá')
  }

  return data as ReviewItem[]
}

export async function taoDanhGia(payload: CreateReviewPayload): Promise<ReviewItem> {
  const response = await fetch(`${API_BASE_URL}/review/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${useAuthStore.getState().requireAccessToken()}`,
    },
    body: JSON.stringify({
      bookingId: payload.bookingId,
      soSao: payload.soSao,
      noiDung: payload.noiDung.trim(),
    }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(response.status === 401 ? SESSION_EXPIRED_MESSAGE : data?.message || 'Gửi đánh giá thất bại')
  }

  return data as ReviewItem
}
