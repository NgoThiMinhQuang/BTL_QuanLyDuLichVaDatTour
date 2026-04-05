import { API_BASE_URL } from '../../constants/api'
import { layBangGiaLichKhoiHanh, layLichKhoiHanhTour, layTourChiTiet } from '../tour/layTourChiTiet'
import type { DeparturePricingItem, TourDetailApiItem, DepartureItem } from '../../types/tour'
import { useAuthStore } from '../../store/authStore'

export interface BookingPassengerPayload {
  hoTen: string
  loaiKhach: 'nguoi_lon' | 'tre_em' | 'em_be'
  ngaySinh?: string
  gioiTinh?: string
  soGiayTo?: string
  quocTich?: string
  ghiChu?: string
}

export interface CreateBookingPayload {
  lichKhoiHanhId: number
  hoTenLienHe: string
  emailLienHe: string
  soDienThoaiLienHe: string
  diaChiLienHe?: string
  soNguoiLon: number
  soTreEm: number
  soEmBe: number
  phuongThucThanhToanDuKien?: string
  maVoucher?: string
  hanhKhachs?: BookingPassengerPayload[]
  ghiChu?: string
}

export interface BookingPassenger {
  id: number
  hoTen: string
  loaiKhach: string
  ngaySinh: string | null
  gioiTinh: string | null
  soGiayTo: string | null
  quocTich: string | null
  ghiChu: string | null
}

export interface BookingResponse {
  id: number
  maBooking: string
  lichKhoiHanhId: number
  maDotTour: string
  ngayKhoiHanh: string
  ngayKetThuc: string
  tourId: number
  maTour: string
  tenTour: string
  hoTenLienHe: string
  emailLienHe: string
  soDienThoaiLienHe: string
  diaChiLienHe: string | null
  ngayDat: string
  soNguoiLon: number
  soTreEm: number
  soEmBe: number
  tongHanhKhach: number
  loaiGiaApDung: string
  donGiaNguoiLon: number
  donGiaTreEm: number
  donGiaEmBe: number
  tamTinh: number
  giamGia: number
  voucherId: number | null
  maVoucher: string | null
  tenVoucher: string | null
  tongTien: number
  soTienDaThanhToan: number
  tienCocYeuCau: number
  phuongThucThanhToanDuKien: string | null
  trangThaiBooking: string
  trangThaiThanhToan: string
  hanThanhToan: string | null
  ghiChu: string | null
  hanhKhachs: BookingPassenger[]
  coTheDanhGia: boolean
  daDanhGia: boolean
  createdAt: string
  updatedAt: string
}

export interface BookingListItem {
  id: number
  maBooking: string
  tenTour: string
  maDotTour: string
  ngayKhoiHanh: string
  tongHanhKhach: number
  tongTien: number
  trangThaiBooking: string
  trangThaiThanhToan: string
  ngayDat: string
  coTheDanhGia: boolean
  daDanhGia: boolean
}

function getAuthHeaders(contentType = false) {
  return {
    ...(contentType ? { 'Content-Type': 'application/json' } : {}),
    Authorization: `Bearer ${useAuthStore.getState().requireAccessToken()}`,
  }
}

async function handleApiResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || fallbackMessage)
  }

  return data as T
}

export async function layDanhSachBookingCuaToi(): Promise<BookingListItem[]> {
  const response = await fetch(`${API_BASE_URL}/booking/my-bookings`, {
    headers: getAuthHeaders(),
  })

  return handleApiResponse<BookingListItem[]>(response, 'Không thể tải danh sách booking')
}

export async function layChiTietBooking(id: number): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE_URL}/booking/get-by-id/${id}`, {
    headers: getAuthHeaders(),
  })

  return handleApiResponse<BookingResponse>(response, 'Không thể tải chi tiết booking')
}

export async function layThanhToanTheoBooking(bookingId: number) {
  const response = await fetch(`${API_BASE_URL}/payment/booking/${bookingId}`, {
    headers: getAuthHeaders(),
  })

  return handleApiResponse<Array<{
    id: number
    bookingId: number
    loaiGiaoDich: string
    kenhThanhToan: string
    phuongThucThanhToan: string
    nhaCungCap: string | null
    soTien: number
    maGiaoDichNoiBo: string | null
    maGiaoDichBenThuBa: string | null
    maThamChieuBenThuBa: string | null
    duLieuPhanHoi: string | null
    ghiChu: string | null
    trangThai: string
    thoiGianTao: string
    updatedAt: string
  }>>(response, 'Không thể tải lịch sử thanh toán')
}

export interface BookingPageData {
  tour: TourDetailApiItem
  departure: DepartureItem
  pricing: DeparturePricingItem
}

const paymentMethodMap: Record<string, string> = {
  tien_mat: 'tien_mat',
  chuyen_khoan: 'chuyen_khoan',
  the: 'the',
  vi_dien_tu: 'vi_dien_tu',
  cong_thanh_toan: 'cong_thanh_toan',
}

export async function layDuLieuDatTour(tourId: number, departureId: number): Promise<BookingPageData> {
  const [tour, departures] = await Promise.all([
    layTourChiTiet(tourId),
    layLichKhoiHanhTour(tourId),
  ])

  const departure = departures.find((item) => item.id === departureId)

  if (!departure) {
    throw new Error('Lịch khởi hành không còn hợp lệ')
  }

  const pricing = await layBangGiaLichKhoiHanh(departureId)

  return {
    tour,
    departure,
    pricing,
  }
}

export async function taoBooking(payload: CreateBookingPayload): Promise<BookingResponse> {
  const response = await fetch(`${API_BASE_URL}/booking/create`, {
    method: 'POST',
    headers: getAuthHeaders(true),
    body: JSON.stringify({
      lichKhoiHanhId: payload.lichKhoiHanhId,
      hoTenLienHe: payload.hoTenLienHe,
      emailLienHe: payload.emailLienHe,
      soDienThoaiLienHe: payload.soDienThoaiLienHe,
      diaChiLienHe: payload.diaChiLienHe || undefined,
      soNguoiLon: payload.soNguoiLon,
      soTreEm: payload.soTreEm,
      soEmBe: payload.soEmBe,
      phuongThucThanhToanDuKien: payload.phuongThucThanhToanDuKien
        ? paymentMethodMap[payload.phuongThucThanhToanDuKien] ?? payload.phuongThucThanhToanDuKien
        : undefined,
      maVoucher: payload.maVoucher?.trim() || undefined,
      hanhKhachs: payload.hanhKhachs?.map((item) => ({
        hoTen: item.hoTen,
        loaiKhach: item.loaiKhach,
        ngaySinh: item.ngaySinh || undefined,
        gioiTinh: item.gioiTinh || undefined,
        soGiayTo: item.soGiayTo || undefined,
        quocTich: item.quocTich || undefined,
        ghiChu: item.ghiChu || undefined,
      })),
      ghiChu: payload.ghiChu || undefined,
    }),
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Đặt tour thất bại')
  }

  return data as BookingResponse
}
