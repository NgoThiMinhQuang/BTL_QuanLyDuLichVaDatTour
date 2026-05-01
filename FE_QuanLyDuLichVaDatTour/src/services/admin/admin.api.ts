import { API_BASE_URL } from '../../constants/api'
import { SESSION_EXPIRED_MESSAGE, useAuthStore } from '../../store/authStore'
import type {
  AdminBookingItem,
  AdminCreateDiaDiemPayload,
  AdminCreateLichKhoiHanhPayload,
  AdminCreateLichTrinhPayload,
  AdminCreateLoaiTourPayload,
  AdminCreateTinTucPayload,
  AdminCreateTourPayload,
  AdminCreateVoucherPayload,
  AdminDashboardSummary,
  AdminDiaDiemItem,
  AdminDiaDiemStatus,
  AdminLichKhoiHanhItem,
  AdminLichKhoiHanhStatus,
  AdminLichTrinhItem,
  AdminLoaiTourItem,
  AdminLoaiTourStatus,
  AdminPaymentItem,
  AdminPaymentTransactionStatus,
  AdminReviewDisplayStatus,
  AdminReviewItem,
  AdminTinTucItem,
  AdminTinTucStatus,
  AdminTourItem,
  AdminTourStatus,
  AdminUpdateBookingStatusPayload,
  AdminUpdateDiaDiemPayload,
  AdminUpdateLichKhoiHanhPayload,
  AdminUpdateLichTrinhPayload,
  AdminUpdateLoaiTourPayload,
  AdminUpdatePaymentStatusPayload,
  AdminUpdateReviewStatusPayload,
  AdminUpdateTinTucPayload,
  AdminUpdateTourPayload,
  AdminUpdateVoucherPayload,
  AdminVoucherItem,
  AdminVoucherStatus,
} from '../../types/admin'

function getAuthHeaders(contentType = false) {
  return {
    ...(contentType ? { 'Content-Type': 'application/json' } : {}),
    Authorization: `Bearer ${useAuthStore.getState().requireAccessToken()}`,
  }
}

async function handleApiResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  if (response.status === 401) {
    useAuthStore.getState().clearAuthSession()
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(response.status === 401 ? SESSION_EXPIRED_MESSAGE : data?.message || fallbackMessage)
  }

  return data as T
}

async function getJson<T>(path: string, fallbackMessage: string) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: getAuthHeaders(),
  })

  return handleApiResponse<T>(response, fallbackMessage)
}

async function sendJson<TResponse, TBody>(
  path: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body: TBody | undefined,
  fallbackMessage: string,
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: getAuthHeaders(method !== 'DELETE' || body !== undefined),
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })

  return handleApiResponse<TResponse>(response, fallbackMessage)
}

export async function layTongQuanQuanTri(): Promise<AdminDashboardSummary> {
  return getJson<AdminDashboardSummary>('/admin/dashboard/summary', 'Không thể tải dashboard quản trị')
}

export async function layDanhSachTourQuanTri(): Promise<AdminTourItem[]> {
  return getJson<AdminTourItem[]>('/admin/tour/get-all', 'Không thể tải danh sách tour quản trị')
}

export async function layChiTietTourQuanTri(id: number): Promise<AdminTourItem> {
  return getJson<AdminTourItem>(`/admin/tour/get-by-id/${id}`, 'Không thể tải chi tiết tour')
}

export async function taoTourQuanTri(payload: AdminCreateTourPayload) {
  return sendJson<AdminTourItem, AdminCreateTourPayload>('/admin/tour/create', 'POST', payload, 'Không thể tạo tour')
}

export async function capNhatTourQuanTri(id: number, payload: AdminUpdateTourPayload) {
  return sendJson<AdminTourItem, AdminUpdateTourPayload>(`/admin/tour/update/${id}`, 'PUT', payload, 'Không thể cập nhật tour')
}

export async function capNhatTrangThaiTourQuanTri(id: number, trangThai: AdminTourStatus) {
  return sendJson<void, { trangThai: AdminTourStatus }>(`/admin/tour/update-status/${id}`, 'PATCH', { trangThai }, 'Không thể cập nhật trạng thái tour')
}

export async function anTourQuanTri(id: number) {
  return sendJson<void, undefined>(`/admin/tour/hide/${id}`, 'PATCH', undefined, 'Không thể ẩn tour')
}

export async function layDanhSachBookingQuanTri(): Promise<AdminBookingItem[]> {
  return getJson<AdminBookingItem[]>('/admin/booking/get-all', 'Không thể tải danh sách booking quản trị')
}

export async function layChiTietBookingQuanTri(id: number): Promise<AdminBookingItem> {
  return getJson<AdminBookingItem>(`/admin/booking/get-by-id/${id}`, 'Không thể tải chi tiết booking')
}

export async function capNhatTrangThaiBookingQuanTri(id: number, payload: AdminUpdateBookingStatusPayload) {
  return sendJson<void, AdminUpdateBookingStatusPayload>(`/admin/booking/update-status/${id}`, 'PATCH', payload, 'Không thể cập nhật trạng thái booking')
}

export async function layDanhSachPaymentQuanTri(): Promise<AdminPaymentItem[]> {
  return getJson<AdminPaymentItem[]>('/admin/payment/get-all', 'Không thể tải danh sách thanh toán quản trị')
}

export async function layChiTietPaymentQuanTri(id: number): Promise<AdminPaymentItem> {
  return getJson<AdminPaymentItem>(`/admin/payment/get-by-id/${id}`, 'Không thể tải chi tiết thanh toán')
}

export async function capNhatTrangThaiPaymentQuanTri(id: number, payload: AdminUpdatePaymentStatusPayload) {
  return sendJson<void, AdminUpdatePaymentStatusPayload>(`/admin/payment/update-status/${id}`, 'PATCH', payload, 'Không thể cập nhật trạng thái thanh toán')
}

export async function layDanhSachLoaiTourQuanTri(): Promise<AdminLoaiTourItem[]> {
  return getJson<AdminLoaiTourItem[]>('/admin/loai-tour/get-all', 'Không thể tải loại tour quản trị')
}

export async function layChiTietLoaiTourQuanTri(id: number): Promise<AdminLoaiTourItem> {
  return getJson<AdminLoaiTourItem>(`/admin/loai-tour/get-by-id/${id}`, 'Không thể tải chi tiết loại tour')
}

export async function taoLoaiTourQuanTri(payload: AdminCreateLoaiTourPayload) {
  return sendJson<AdminLoaiTourItem, AdminCreateLoaiTourPayload>('/admin/loai-tour/create', 'POST', payload, 'Không thể tạo loại tour')
}

export async function capNhatLoaiTourQuanTri(id: number, payload: AdminUpdateLoaiTourPayload) {
  return sendJson<AdminLoaiTourItem, AdminUpdateLoaiTourPayload>(`/admin/loai-tour/update/${id}`, 'PUT', payload, 'Không thể cập nhật loại tour')
}

export async function capNhatTrangThaiLoaiTourQuanTri(id: number, trangThai: AdminLoaiTourStatus) {
  return sendJson<void, { trangThai: AdminLoaiTourStatus }>(`/admin/loai-tour/update-status/${id}`, 'PATCH', { trangThai }, 'Không thể cập nhật trạng thái loại tour')
}

export async function layDanhSachDiaDiemQuanTri(): Promise<AdminDiaDiemItem[]> {
  return getJson<AdminDiaDiemItem[]>('/admin/dia-diem/get-all', 'Không thể tải điểm đi quản trị')
}

export async function layChiTietDiaDiemQuanTri(id: number): Promise<AdminDiaDiemItem> {
  return getJson<AdminDiaDiemItem>(`/admin/dia-diem/get-by-id/${id}`, 'Không thể tải chi tiết điểm đi')
}

export async function taoDiaDiemQuanTri(payload: AdminCreateDiaDiemPayload) {
  return sendJson<AdminDiaDiemItem, AdminCreateDiaDiemPayload>('/admin/dia-diem/create', 'POST', payload, 'Không thể tạo điểm đi')
}

export async function capNhatDiaDiemQuanTri(id: number, payload: AdminUpdateDiaDiemPayload) {
  return sendJson<AdminDiaDiemItem, AdminUpdateDiaDiemPayload>(`/admin/dia-diem/update/${id}`, 'PUT', payload, 'Không thể cập nhật điểm đi')
}

export async function capNhatTrangThaiDiaDiemQuanTri(id: number, trangThai: AdminDiaDiemStatus) {
  return sendJson<void, { trangThai: AdminDiaDiemStatus }>(`/admin/dia-diem/update-status/${id}`, 'PATCH', { trangThai }, 'Không thể cập nhật trạng thái điểm đi')
}

export async function layDanhSachVoucherQuanTri(): Promise<AdminVoucherItem[]> {
  return getJson<AdminVoucherItem[]>('/admin/voucher/get-all', 'Không thể tải voucher quản trị')
}

export async function layChiTietVoucherQuanTri(id: number): Promise<AdminVoucherItem> {
  return getJson<AdminVoucherItem>(`/admin/voucher/get-by-id/${id}`, 'Không thể tải chi tiết voucher')
}

export async function taoVoucherQuanTri(payload: AdminCreateVoucherPayload) {
  return sendJson<AdminVoucherItem, AdminCreateVoucherPayload>('/admin/voucher/create', 'POST', payload, 'Không thể tạo voucher')
}

export async function capNhatVoucherQuanTri(id: number, payload: AdminUpdateVoucherPayload) {
  return sendJson<AdminVoucherItem, AdminUpdateVoucherPayload>(`/admin/voucher/update/${id}`, 'PUT', payload, 'Không thể cập nhật voucher')
}

export async function capNhatTrangThaiVoucherQuanTri(id: number, trangThai: AdminVoucherStatus) {
  return sendJson<void, { trangThai: AdminVoucherStatus }>(`/admin/voucher/update-status/${id}`, 'PATCH', { trangThai }, 'Không thể cập nhật trạng thái voucher')
}

export async function layDanhSachLichKhoiHanhQuanTri(): Promise<AdminLichKhoiHanhItem[]> {
  return getJson<AdminLichKhoiHanhItem[]>('/admin/lich-khoi-hanh/get-all', 'Không thể tải lịch khởi hành quản trị')
}

export async function layChiTietLichKhoiHanhQuanTri(id: number): Promise<AdminLichKhoiHanhItem> {
  return getJson<AdminLichKhoiHanhItem>(`/admin/lich-khoi-hanh/get-by-id/${id}`, 'Không thể tải chi tiết lịch khởi hành')
}

export async function layLichKhoiHanhTheoTourQuanTri(tourId: number): Promise<AdminLichKhoiHanhItem[]> {
  return getJson<AdminLichKhoiHanhItem[]>(`/admin/lich-khoi-hanh/get-by-tour/${tourId}`, 'Không thể tải lịch khởi hành theo tour')
}

export async function taoLichKhoiHanhQuanTri(payload: AdminCreateLichKhoiHanhPayload) {
  return sendJson<AdminLichKhoiHanhItem, AdminCreateLichKhoiHanhPayload>('/admin/lich-khoi-hanh/create', 'POST', payload, 'Không thể tạo lịch khởi hành')
}

export async function capNhatLichKhoiHanhQuanTri(id: number, payload: AdminUpdateLichKhoiHanhPayload) {
  return sendJson<AdminLichKhoiHanhItem, AdminUpdateLichKhoiHanhPayload>(`/admin/lich-khoi-hanh/update/${id}`, 'PUT', payload, 'Không thể cập nhật lịch khởi hành')
}

export async function capNhatTrangThaiLichKhoiHanhQuanTri(id: number, trangThai: AdminLichKhoiHanhStatus) {
  return sendJson<void, { trangThai: AdminLichKhoiHanhStatus }>(`/admin/lich-khoi-hanh/update-status/${id}`, 'PATCH', { trangThai }, 'Không thể cập nhật trạng thái lịch khởi hành')
}

export async function layDanhSachLichTrinhQuanTri(): Promise<AdminLichTrinhItem[]> {
  return getJson<AdminLichTrinhItem[]>('/admin/lich-trinh/get-all', 'Không thể tải lịch trình quản trị')
}

export async function layChiTietLichTrinhQuanTri(id: number): Promise<AdminLichTrinhItem> {
  return getJson<AdminLichTrinhItem>(`/admin/lich-trinh/get-by-id/${id}`, 'Không thể tải chi tiết lịch trình')
}

export async function layLichTrinhTheoTourQuanTri(tourId: number): Promise<AdminLichTrinhItem[]> {
  return getJson<AdminLichTrinhItem[]>(`/admin/lich-trinh/get-by-tour/${tourId}`, 'Không thể tải lịch trình theo tour')
}

export async function taoLichTrinhQuanTri(payload: AdminCreateLichTrinhPayload) {
  return sendJson<AdminLichTrinhItem, AdminCreateLichTrinhPayload>('/admin/lich-trinh/create', 'POST', payload, 'Không thể tạo lịch trình')
}

export async function capNhatLichTrinhQuanTri(id: number, payload: AdminUpdateLichTrinhPayload) {
  return sendJson<AdminLichTrinhItem, AdminUpdateLichTrinhPayload>(`/admin/lich-trinh/update/${id}`, 'PUT', payload, 'Không thể cập nhật lịch trình')
}

export async function xoaLichTrinhQuanTri(id: number) {
  return sendJson<void, undefined>(`/admin/lich-trinh/delete/${id}`, 'DELETE', undefined, 'Không thể xoá lịch trình')
}

export async function layDanhSachTinTucQuanTri(): Promise<AdminTinTucItem[]> {
  return getJson<AdminTinTucItem[]>('/admin/tin-tuc/get-all', 'Không thể tải tin tức quản trị')
}

export async function layChiTietTinTucQuanTri(id: number): Promise<AdminTinTucItem> {
  return getJson<AdminTinTucItem>(`/admin/tin-tuc/get-by-id/${id}`, 'Không thể tải chi tiết tin tức')
}

export async function taoTinTucQuanTri(payload: AdminCreateTinTucPayload) {
  return sendJson<AdminTinTucItem, AdminCreateTinTucPayload>('/admin/tin-tuc/create', 'POST', payload, 'Không thể tạo tin tức')
}

export async function capNhatTinTucQuanTri(id: number, payload: AdminUpdateTinTucPayload) {
  return sendJson<AdminTinTucItem, AdminUpdateTinTucPayload>(`/admin/tin-tuc/update/${id}`, 'PUT', payload, 'Không thể cập nhật tin tức')
}

export async function capNhatTrangThaiTinTucQuanTri(id: number, trangThai: AdminTinTucStatus) {
  return sendJson<void, { trangThai: AdminTinTucStatus }>(`/admin/tin-tuc/update-status/${id}`, 'PATCH', { trangThai }, 'Không thể cập nhật trạng thái tin tức')
}

export async function layReviewChoDuyetQuanTri(limit = 50): Promise<AdminReviewItem[]> {
  return getJson<AdminReviewItem[]>(`/admin/review/pending?limit=${limit}`, 'Không thể tải danh sách review chờ duyệt')
}

export async function capNhatTrangThaiReviewQuanTri(id: number, payload: AdminUpdateReviewStatusPayload) {
  return sendJson<void, AdminUpdateReviewStatusPayload>(`/admin/review/update-status/${id}`, 'PATCH', payload, 'Không thể cập nhật trạng thái đánh giá')
}

export const layLoaiTourQuanTri = layDanhSachLoaiTourQuanTri
export const layDiaDiemQuanTri = layDanhSachDiaDiemQuanTri
