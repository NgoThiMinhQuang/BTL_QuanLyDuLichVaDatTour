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
  AdminKhachHangItem,
  AdminKhachHangListResponse,
  AdminKhachHangStatus,
  AdminAuditLogItem,
  AdminAuditLogListResponse,
  AdminChatMessage,
  AdminLienHeItem,
  AdminLienHeListResponse,
  AdminSupportTicketItem,
  AdminUpdateLienHeStatusPayload,
  GlobalSearchResponse,
  AdminLichKhoiHanhItem,
  AdminLichKhoiHanhStatus,
  AdminLichTrinhItem,
  AdminLoaiTourItem,
  AdminLoaiTourStatus,
  AdminPaymentItem,
  AdminPaymentTransactionStatus,
  AdminReviewDisplayStatus,
  AdminReviewItem,
  AdminSearchAuditLogParams,
  AdminSearchKhachHangParams,
  AdminSearchLienHeParams,
  AdminTinTucItem,
  AdminTinTucStatus,
  AdminTourItem,
  AdminTourStatus,
  AdminUpdateBookingStatusPayload,
  AdminUpdateDiaDiemPayload,
  AdminUpdateKhachHangStatusPayload,
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
// getAuthHeaders() tạo header gửi lên Backend.
function getAuthHeaders(contentType = false) {
  return {
    ...(contentType ? { 'Content-Type': 'application/json' } : {}),
    Authorization: `Bearer ${useAuthStore.getState().requireAccessToken()}`,
  }
}
// xử lý kết quả API trả về.
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
// getJson() là hàm dùng chung để gọi API dạng GET.
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
// hàm service gọi API sang Backend để lấy dữ liệu thống kê tổng quan.
export async function layTongQuanQuanTri(): Promise<AdminDashboardSummary> {
  return getJson<AdminDashboardSummary>('/admin/dashboard/summary', 'Không thể tải dashboard quản trị')
}

export async function layDanhSachTourQuanTri(): Promise<AdminTourItem[]> {
  return getJson<AdminTourItem[]>('/admin/tour/get-all', 'Không thể tải danh sách tour quản trị')
}
// getJson() là hàm dùng chung để gọi API dạng GET., giúp tự động gắn token vào header
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

export async function layTatCaReviewQuanTri(): Promise<AdminReviewItem[]> {
  return getJson<AdminReviewItem[]>('/admin/review/get-all', 'Không thể tải danh sách review')
}

export async function capNhatTrangThaiReviewQuanTri(id: number, payload: AdminUpdateReviewStatusPayload) {
  return sendJson<void, AdminUpdateReviewStatusPayload>(`/admin/review/update-status/${id}`, 'PATCH', payload, 'Không thể cập nhật trạng thái đánh giá')
}

export const layLoaiTourQuanTri = layDanhSachLoaiTourQuanTri
export const layDiaDiemQuanTri = layDanhSachDiaDiemQuanTri

export async function timKiemKhachHangQuanTri(params: AdminSearchKhachHangParams): Promise<AdminKhachHangListResponse> {
  const query = new URLSearchParams()
  if (params.keyword) query.set('keyword', params.keyword)
  if (params.vaiTro) query.set('vaiTro', params.vaiTro)
  if (params.trangThai) query.set('trangThai', params.trangThai)
  query.set('page', String(params.page ?? 1))
  query.set('pageSize', String(params.pageSize ?? 10))
  return getJson<AdminKhachHangListResponse>(`/admin/khach-hang/search?${query}`, 'Không thể tải danh sách khách hàng')
}

export async function layChiTietKhachHangQuanTri(id: number): Promise<AdminKhachHangItem> {
  return getJson<AdminKhachHangItem>(`/admin/khach-hang/get-by-id/${id}`, 'Không thể tải chi tiết khách hàng')
}

export async function capNhatTrangThaiKhachHangQuanTri(id: number, trangThai: AdminKhachHangStatus) {
  return sendJson<void, AdminUpdateKhachHangStatusPayload>(`/admin/khach-hang/update-status/${id}`, 'PATCH', { trangThai }, 'Không thể cập nhật trạng thái khách hàng')
}

export async function layKetQuaTimKiemQuanTri(q: string): Promise<GlobalSearchResponse> {
  return getJson<GlobalSearchResponse>(`/admin/search?q=${encodeURIComponent(q)}`, 'Tìm kiếm thất bại')
}

export async function timKiemLienHeQuanTri(params: AdminSearchLienHeParams): Promise<AdminLienHeListResponse> {
  const query = new URLSearchParams()
  if (params.keyword) query.set('keyword', params.keyword)
  if (params.trangThai) query.set('trangThai', params.trangThai)
  query.set('page', String(params.page ?? 1))
  query.set('pageSize', String(params.pageSize ?? 10))
  return getJson<AdminLienHeListResponse>(`/admin/lien-he/search?${query}`, 'Không thể tải danh sách liên hệ')
}

export async function layChiTietLienHeQuanTri(id: number): Promise<AdminLienHeItem> {
  return getJson<AdminLienHeItem>(`/admin/lien-he/get-by-id/${id}`, 'Không thể tải chi tiết liên hệ')
}

export async function laySupportTicketsQuanTri(params: AdminSearchLienHeParams): Promise<AdminSupportTicketItem[]> {
  const query = new URLSearchParams()
  if (params.keyword) query.set('keyword', params.keyword)
  if (params.trangThai) query.set('trangThai', params.trangThai)
  query.set('page', String(params.page ?? 1))
  query.set('pageSize', String(params.pageSize ?? 10))
  return getJson<AdminSupportTicketItem[]>(`/admin/lien-he/support-tickets?${query}`, 'Không thể tải hộp thư hỗ trợ')
}

export async function layTinNhanHoTroQuanTri(khachHangId: number): Promise<AdminChatMessage[]> {
  return getJson<AdminChatMessage[]>(`/tin-nhan/general/khach/${khachHangId}`, 'Không thể tải tin nhắn hỗ trợ')
}

export async function traLoiTinNhanHoTroQuanTri(khachHangId: number, noiDung: string): Promise<AdminChatMessage> {
  return sendJson<AdminChatMessage, { khachHangId: number; noiDung: string }>(
    '/tin-nhan/general/admin-reply',
    'POST',
    { khachHangId, noiDung },
    'Không thể gửi phản hồi hỗ trợ',
  )
}

export async function capNhatTrangThaiLienHeQuanTri(id: number, payload: AdminUpdateLienHeStatusPayload) {
  return sendJson<void, AdminUpdateLienHeStatusPayload>(`/admin/lien-he/update-status/${id}`, 'PATCH', payload, 'Không thể cập nhật trạng thái liên hệ')
}

export async function timKiemAuditLogQuanTri(params: AdminSearchAuditLogParams): Promise<AdminAuditLogListResponse> {
  const query = new URLSearchParams()
  if (params.keyword) query.set('keyword', params.keyword)
  if (params.hanhDong) query.set('hanhDong', params.hanhDong)
  if (params.bang) query.set('bang', params.bang)
  if (params.tuNgay) query.set('tuNgay', params.tuNgay)
  if (params.denNgay) query.set('denNgay', params.denNgay)
  query.set('page', String(params.page ?? 1))
  query.set('pageSize', String(params.pageSize ?? 20))
  return getJson<AdminAuditLogListResponse>(`/admin/audit-log/search?${query}`, 'Không thể tải nhật ký hệ thống')
}

import type { AdminTourDestination, AdminTourImage, AdminAddTourDiemDenPayload, AdminUpdateTourDiemDenPayload, AdminAddAnhTourPayload, AdminBangGiaLichKhoiHanh, AdminBangGiaLichKhoiHanhPayload } from '../../types/admin'

// ── TourDiemDen ──

export async function themDiemDenTourQuanTri(tourId: number, payload: AdminAddTourDiemDenPayload): Promise<AdminTourDestination> {
  return sendJson<AdminTourDestination, AdminAddTourDiemDenPayload>(`/admin/tour/${tourId}/diem-den`, 'POST', payload, 'Không thể thêm điểm đến')
}

export async function xoaDiemDenTourQuanTri(tourDiemDenId: number) {
  return sendJson<void, undefined>(`/admin/tour/diem-den/${tourDiemDenId}`, 'DELETE', undefined, 'Không thể xoá điểm đến')
}

export async function capNhatDiemDenTourQuanTri(tourDiemDenId: number, payload: AdminUpdateTourDiemDenPayload): Promise<AdminTourDestination> {
  return sendJson<AdminTourDestination, AdminUpdateTourDiemDenPayload>(`/admin/tour/diem-den/${tourDiemDenId}`, 'PUT', payload, 'Không thể cập nhật điểm đến')
}

export async function sapXepDiemDenTourQuanTri(tourId: number, diemDenIds: number[]): Promise<AdminTourDestination[]> {
  return sendJson<AdminTourDestination[], number[]>(`/admin/tour/${tourId}/diem-den/reorder`, 'PUT', diemDenIds, 'Không thể sắp xếp điểm đến')
}

// ── AnhTour ──

export async function themAnhTourQuanTri(tourId: number, payload: AdminAddAnhTourPayload): Promise<AdminTourImage> {
  return sendJson<AdminTourImage, AdminAddAnhTourPayload>(`/admin/tour/${tourId}/anh`, 'POST', payload, 'Không thể thêm ảnh tour')
}

export async function xoaAnhTourQuanTri(anhTourId: number) {
  return sendJson<void, undefined>(`/admin/tour/anh/${anhTourId}`, 'DELETE', undefined, 'Không thể xoá ảnh tour')
}

export async function datAnhDaiDienTourQuanTri(anhTourId: number): Promise<AdminTourImage> {
  return sendJson<AdminTourImage, undefined>(`/admin/tour/anh/${anhTourId}/set-avatar`, 'PATCH', undefined, 'Không thể đặt ảnh đại diện')
}

export async function sapXepAnhTourQuanTri(tourId: number, anhTourIds: number[]): Promise<AdminTourImage[]> {
  return sendJson<AdminTourImage[], number[]>(`/admin/tour/${tourId}/anh/reorder`, 'PUT', anhTourIds, 'Không thể sắp xếp ảnh')
}

export async function capNhatAnhTourQuanTri(anhTourId: number, payload: { moTa?: string | null }): Promise<AdminTourImage> {
  return sendJson<AdminTourImage, { moTa?: string | null }>(`/admin/tour/anh/${anhTourId}`, 'PUT', payload, 'Không thể cập nhật ảnh tour')
}

// ── BangGiaLichKhoiHanh ──

export async function layBangGiaLichKhoiHanhQuanTri(lichKhoiHanhId: number): Promise<AdminBangGiaLichKhoiHanh> {
  return getJson<AdminBangGiaLichKhoiHanh>(`/admin/lich-khoi-hanh/get-by-id/${lichKhoiHanhId}/bang-gia`, 'Không thể tải bảng giá')
}

export async function capNhatBangGiaLichKhoiHanhQuanTri(lichKhoiHanhId: number, payload: AdminBangGiaLichKhoiHanhPayload): Promise<AdminBangGiaLichKhoiHanh> {
  return sendJson<AdminBangGiaLichKhoiHanh, AdminBangGiaLichKhoiHanhPayload>(`/admin/lich-khoi-hanh/${lichKhoiHanhId}/bang-gia`, 'PUT', payload, 'Không thể cập nhật bảng giá')
}

export async function xoaBangGiaLichKhoiHanhQuanTri(lichKhoiHanhId: number) {
  return sendJson<void, undefined>(`/admin/lich-khoi-hanh/${lichKhoiHanhId}/bang-gia`, 'DELETE', undefined, 'Không thể xoá bảng giá')
}

// ── Voucher Statistics ──

export interface AdminVoucherStatistics {
  id: number
  maVoucher: string
  tenVoucher: string
  kieuGiam: string
  giaTriGiam: number
  soLuotDaDung: number
  soLuongToiDa: number
  tongDoanhThuTuVoucher: number
  tongGiamGia: number
  trangThai: string
}

export async function layThongKeVoucherQuanTri(): Promise<AdminVoucherStatistics[]> {
  return getJson<AdminVoucherStatistics[]>('/admin/voucher/statistics', 'Không thể tải thống kê voucher')
}

// ── Payment Confirm & Refund ──

export async function xacNhanThanhToanQuanTri(id: number, ghiChu?: string): Promise<AdminPaymentItem> {
  return sendJson<AdminPaymentItem, { ghiChu?: string | null }>(`/admin/payment/confirm/${id}`, 'POST', { ghiChu: ghiChu ?? null }, 'Không thể xác nhận thanh toán')
}

export interface AdminRefundPayload {
  soTien: number
  lyDo: string
  hoanToanBo: boolean
}

export async function hoanTienQuanTri(id: number, payload: AdminRefundPayload): Promise<AdminPaymentItem> {
  return sendJson<AdminPaymentItem, AdminRefundPayload>(`/admin/payment/refund/${id}`, 'POST', payload, 'Không thể hoàn tiền')
}

// ── Review Approve/Hide ──

export async function duyetDanhGiaQuanTri(id: number, phanHoi?: string) {
  return sendJson<{ message: string }, { phanHoiAdmin?: string | null } | undefined>(`/admin/review/approve/${id}`, 'POST', phanHoi ? { phanHoiAdmin: phanHoi } : undefined, 'Không thể duyệt đánh giá')
}

export async function anDanhGiaQuanTri(id: number, phanHoi?: string) {
  return sendJson<{ message: string }, { phanHoiAdmin?: string | null } | undefined>(`/admin/review/hide/${id}`, 'POST', phanHoi ? { phanHoiAdmin: phanHoi } : undefined, 'Không thể ẩn đánh giá')
}

// ── LienHe Reply ──

export async function phanHoiLienHeQuanTri(id: number, phanHoi: string) {
  return sendJson<{ message: string }, { trangThai: string; phanHoi: string }>(`/admin/lien-he/reply/${id}`, 'POST', { trangThai: 'da_xu_ly', phanHoi }, 'Không thể gửi phản hồi')
}

// ── Broadcast Notification ──

export interface AdminBroadcastPayload {
  tieuDe: string
  noiDung: string
  duongDan?: string | null
  loai?: string
  userId?: number | null
}

export async function guiThongBaoHangLoatQuanTri(payload: AdminBroadcastPayload) {
  return sendJson<{ message: string; recipientCount: number }, AdminBroadcastPayload>('/thong-bao/broadcast', 'POST', payload, 'Không thể gửi thông báo')
}

// ── Booking Filter & Export ──

export interface AdminBookingFilter {
  status?: string
  fromDate?: string
  toDate?: string
  sortBy?: string
  ascending?: boolean
}

export async function layDanhSachBookingTheoBoLocQuanTri(filter: AdminBookingFilter): Promise<AdminBookingItem[]> {
  const query = new URLSearchParams()
  if (filter.status) query.set('status', filter.status)
  if (filter.fromDate) query.set('fromDate', filter.fromDate)
  if (filter.toDate) query.set('toDate', filter.toDate)
  if (filter.sortBy) query.set('sortBy', filter.sortBy)
  if (filter.ascending !== undefined) query.set('ascending', String(filter.ascending))
  return getJson<AdminBookingItem[]>(`/admin/booking/get-all?${query}`, 'Không thể tải danh sách booking')
}

export async function xuatBookingExcelQuanTri(filter: AdminBookingFilter): Promise<Blob> {
  const query = new URLSearchParams()
  if (filter.status) query.set('status', filter.status)
  if (filter.fromDate) query.set('fromDate', filter.fromDate)
  if (filter.toDate) query.set('toDate', filter.toDate)
  const response = await fetch(`${API_BASE_URL}/admin/booking/export?${query}`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) throw new Error('Không thể xuất file Excel')
  return response.blob()
}
