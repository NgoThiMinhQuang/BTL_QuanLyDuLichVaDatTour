import { API_BASE_URL } from '../../constants/api'
import { requireAccessToken } from '../../utils/storage'

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

export async function layDanhGiaCuaToi(): Promise<ReviewItem[]> {
  const response = await fetch(`${API_BASE_URL}/review/my-reviews`, {
    headers: {
      Authorization: `Bearer ${requireAccessToken()}`,
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Không thể tải danh sách đánh giá')
  }

  return data as ReviewItem[]
}

export async function taoDanhGia(payload: CreateReviewPayload): Promise<ReviewItem> {
  const response = await fetch(`${API_BASE_URL}/review/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${requireAccessToken()}`,
    },
    body: JSON.stringify({
      bookingId: payload.bookingId,
      soSao: payload.soSao,
      noiDung: payload.noiDung.trim(),
    }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Gửi đánh giá thất bại')
  }

  return data as ReviewItem
}
