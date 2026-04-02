import { API_BASE_URL } from '../../constant/api'
import { layBangGiaLichKhoiHanh, layLichKhoiHanhTour, layTourChiTiet } from '../tour/layTourChiTiet'
import type { DeparturePricingItem, TourDetailApiItem, DepartureItem } from '../../libs/types/tour'

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
  createdAt: string
  updatedAt: string
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
  const accessToken = localStorage.getItem('accessToken')

  if (!accessToken) {
    throw new Error('Vui lòng đăng nhập để đặt tour')
  }

  const response = await fetch(`${API_BASE_URL}/booking/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
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
