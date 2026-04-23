export type AdminTourStatus = 'nhap' | 'dang_mo_ban' | 'tam_ngung' | 'an' | 'ngung_kinh_doanh'
export type AdminBookingStatus = 'moi_tao' | 'cho_thanh_toan' | 'da_coc' | 'da_xac_nhan' | 'da_huy' | 'hoan_tat'
export type AdminPaymentStatus = 'chua_thanh_toan' | 'thanh_toan_mot_phan' | 'da_thanh_toan_du' | 'that_bai' | 'da_hoan_tien'

export interface AdminTourItem {
  id: number
  maTour: string
  tenTour: string
  tenLoaiTour: string
  tenDiemXuatPhat: string
  soNgay: number
  soDem: number
  phuongTien?: string | null
  giaTuThamKhao: number
  isNoiBat: boolean
  trangThai: AdminTourStatus
  updatedAt: string
}

export interface AdminBookingItem {
  id: number
  maBooking: string
  tourId: number
  maTour: string
  tenTour: string
  ngayDat: string
  tongHanhKhach: number
  tongTien: number
  trangThaiBooking: AdminBookingStatus
  trangThaiThanhToan: AdminPaymentStatus
  hoTenLienHe: string
  hoTenNguoiDat: string
  emailNguoiDat: string
  createdAt: string
}

export interface AdminLoaiTourItem {
  id: number
  ten: string
  trangThai: string
}

export interface AdminDiaDiemItem {
  id: number
  tenDiaDiem: string
  tinhThanh?: string | null
  quocGia: string
  trangThai: string
}

export interface AdminChartPoint {
  nhan: string
  giaTri: number
}

export interface AdminTopTour {
  tourId: number
  maTour: string
  tenTour: string
  soBooking: number
  doanhThu: number
}

export interface AdminRecentBooking {
  id: number
  maBooking: string
  hoTenNguoiDat: string
  tenTour: string
  trangThaiBooking: string
  trangThaiThanhToan: string
  tongTien: number
  ngayDat: string
}

export interface AdminPendingPayment {
  id: number
  maGiaoDich: string
  phuongThucThanhToan: string
  hoTenKhachHang: string
  maBooking: string
  soTien: number
  thoiGianTao: string
}

export interface AdminPendingReview {
  id: number
  hoTenKhachHang: string
  tenTour: string
  soSao: number
  noiDung: string
  ngayDanhGia: string
}

export interface AdminPaymentStatusItem {
  trangThai: string
  soLuong: number
  tyLe: number
}

export interface AdminDashboardSummary {
  tongTour: number
  tourDangMoBan: number
  tongBooking: number
  tongDoanhThu: number
  tongKhachHang: number
  tyLeThanhToanDu: number
  bookingChoXuLy: number
  diemDanhGiaTrungBinh: number
  doanhThuTheoThang: AdminChartPoint[]
  bookingTheoThang: AdminChartPoint[]
  topTours: AdminTopTour[]
  bookingMoi: AdminRecentBooking[]
  thanhToanChoXacNhan: AdminPendingPayment[]
  danhGiaChoDuyet: AdminPendingReview[]
  tinhTrangThanhToan: AdminPaymentStatusItem[]
}
