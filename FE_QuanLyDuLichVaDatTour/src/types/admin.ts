export type AdminTourStatus = 'nhap' | 'dang_mo_ban' | 'tam_ngung' | 'an' | 'ngung_kinh_doanh'
export type AdminBookingStatus = 'moi_tao' | 'cho_thanh_toan' | 'da_coc' | 'da_xac_nhan' | 'da_huy' | 'hoan_tat'
export type AdminPaymentStatus = 'chua_thanh_toan' | 'thanh_toan_mot_phan' | 'da_thanh_toan_du' | 'that_bai' | 'da_hoan_tien'
export type AdminReviewDisplayStatus = 'cho_duyet' | 'hien_thi' | 'an'
export type AdminVoucherStatus = 'hoat_dong' | 'an'
export type AdminVoucherDiscountType = 'phan_tram' | 'so_tien'
export type AdminLoaiTourStatus = 'hoat_dong' | 'an'
export type AdminDiaDiemStatus = 'hoat_dong' | 'an'
export type AdminLichKhoiHanhStatus = 'mo_ban' | 'het_cho' | 'da_khoi_hanh' | 'da_ket_thuc' | 'da_huy'
export type AdminPaymentTransactionStatus = 'khoi_tao' | 'cho_xu_ly' | 'thanh_cong' | 'that_bai' | 'da_hoan_tien'
export type AdminPaymentTransactionType = 'dat_coc' | 'thanh_toan_con_lai' | 'thanh_toan_toan_bo' | 'hoan_tien'
export type AdminPaymentChannel = 'noi_bo' | 'ben_thu_ba'
export type AdminPaymentMethod = 'tien_mat' | 'chuyen_khoan' | 'the' | 'vi_dien_tu' | 'cong_thanh_toan'
export type AdminTinTucStatus = 'nhap' | 'hoat_dong' | 'hien_thi' | 'an'

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

export interface AdminTourDestination {
  id: number
  diaDiemId: number
  tenDiaDiem: string
  tinhThanh?: string | null
  quocGia: string
  thuTu: number
  ghiChu?: string | null
}

export interface AdminTourImage {
  id: number
  linkAnh: string
  moTa?: string | null
  isAvatar: boolean
  thuTu: number
}

export interface AdminTourItem {
  id: number
  maTour: string
  tenTour: string
  loaiTourId: number
  tenLoaiTour: string
  diemXuatPhatId: number
  tenDiemXuatPhat: string
  soNgay: number
  soDem: number
  phuongTien?: string | null
  giaTuThamKhao: number
  moTaNgan?: string | null
  moTaChiTiet?: string | null
  dieuKienTour?: string | null
  isNoiBat: boolean
  diemDens: AdminTourDestination[]
  anhTours: AdminTourImage[]
  trangThai: AdminTourStatus
  createdAt: string
  updatedAt: string
}

export interface AdminBookingTraveler {
  id: number
  hoTen: string
  loaiKhach: string
  ngaySinh?: string | null
  gioiTinh?: string | null
  soGiayTo?: string | null
  quocTich?: string | null
  ghiChu?: string | null
}

export interface AdminBookingItem {
  id: number
  nguoiDungId: number
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
  diaChiLienHe?: string | null
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
  voucherId?: number | null
  maVoucher?: string | null
  tenVoucher?: string | null
  tongTien: number
  soTienDaThanhToan: number
  tienCocYeuCau: number
  phuongThucThanhToanDuKien?: string | null
  trangThaiBooking: AdminBookingStatus
  trangThaiThanhToan: AdminPaymentStatus
  hanThanhToan?: string | null
  ghiChu?: string | null
  hanhKhachs: AdminBookingTraveler[]
  coTheDanhGia: boolean
  daDanhGia: boolean
  hoTenNguoiDat: string
  emailNguoiDat: string
  createdAt: string
  updatedAt: string
}

export interface AdminPaymentItem {
  id: number
  bookingId: number
  maBooking: string
  hoTenKhachHang: string
  loaiGiaoDich: AdminPaymentTransactionType | string
  kenhThanhToan: AdminPaymentChannel | string
  phuongThucThanhToan: AdminPaymentMethod | string
  nhaCungCap?: string | null
  soTien: number
  maGiaoDichNoiBo?: string | null
  maGiaoDichBenThuBa?: string | null
  maThamChieuBenThuBa?: string | null
  duLieuPhanHoi?: string | null
  ghiChu?: string | null
  trangThai: AdminPaymentTransactionStatus
  thoiGianTao: string
  updatedAt: string
}

export interface AdminLoaiTourItem {
  id: number
  ten: string
  moTa?: string | null
  trangThai: AdminLoaiTourStatus
  createdAt: string
  updatedAt: string
}

export interface AdminDiaDiemItem {
  id: number
  tenDiaDiem: string
  tinhThanh?: string | null
  quocGia: string
  moTa?: string | null
  trangThai: AdminDiaDiemStatus
  createdAt: string
  updatedAt: string
}

export interface AdminVoucherItem {
  id: number
  maVoucher: string
  tenVoucher: string
  tourId?: number | null
  maTour?: string | null
  tenTour?: string | null
  kieuGiam: AdminVoucherDiscountType
  giaTriGiam: number
  giamToiDa?: number | null
  donHangToiThieu: number
  ngayBatDau: string
  ngayKetThuc: string
  soLuongToiDa: number
  soLuongDaDung: number
  moTa?: string | null
  trangThai: AdminVoucherStatus
  createdAt: string
  updatedAt: string
}

export interface AdminLichKhoiHanhItem {
  id: number
  tourId: number
  maTour: string
  tenTour: string
  maDotTour: string
  ngayKhoiHanh: string
  ngayKetThuc: string
  noiTapTrung?: string | null
  soChoToiDa: number
  ghiChu?: string | null
  lyDoHuy?: string | null
  trangThai: AdminLichKhoiHanhStatus
  createdAt: string
  updatedAt: string
}

export interface AdminLichTrinhItem {
  id: number
  tourId: number
  tenTour: string
  ngayThu: number
  thuTuTrongNgay: number
  gioBatDau?: string | null
  gioKetThuc?: string | null
  tieuDe?: string | null
  noiDung?: string | null
  diaDiemId?: number | null
  tenDiaDiem?: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminTinTucItem {
  id: number
  tieuDe: string
  slug: string
  tomTat?: string | null
  noiDung: string
  anhDaiDien?: string | null
  danhMuc?: string | null
  ngayDang: string
  trangThai: AdminTinTucStatus
  createdAt: string
  updatedAt: string
}

export interface AdminReviewItem {
  id: number
  bookingId: number
  tourId: number
  khachHangId: number
  hoTenKhachHang: string
  maBooking: string
  tenTour: string
  soSao: number
  noiDung: string
  phanHoiAdmin?: string | null
  trangThai: AdminReviewDisplayStatus
  ngayDanhGia: string
  ngayPhanHoi?: string | null
  createdAt: string
  updatedAt: string
}

export interface AdminCreateTourPayload {
  maTour: string
  tenTour: string
  loaiTourId: number
  diemXuatPhatId: number
  soNgay: number
  soDem: number
  phuongTien?: string | null
  giaTuThamKhao: number
  moTaNgan?: string | null
  moTaChiTiet?: string | null
  dieuKienTour?: string | null
  isNoiBat: boolean
  diemDenIds?: number[]
  anhTours?: string[]
  trangThai?: AdminTourStatus
}

export interface AdminUpdateTourPayload extends AdminCreateTourPayload {
  trangThai: AdminTourStatus
}

export interface AdminUpdateBookingStatusPayload {
  trangThaiBooking: AdminBookingStatus
  trangThaiThanhToan?: AdminPaymentStatus
  ghiChu?: string | null
}

export interface AdminUpdatePaymentStatusPayload {
  trangThai: AdminPaymentTransactionStatus
  ghiChu?: string | null
}

export interface AdminCreateLoaiTourPayload {
  ten: string
  moTa?: string | null
  trangThai?: AdminLoaiTourStatus
}

export interface AdminUpdateLoaiTourPayload {
  ten: string
  moTa?: string | null
  trangThai: AdminLoaiTourStatus
}

export interface AdminCreateDiaDiemPayload {
  tenDiaDiem: string
  tinhThanh?: string | null
  quocGia?: string | null
  moTa?: string | null
  trangThai?: AdminDiaDiemStatus
}

export interface AdminUpdateDiaDiemPayload {
  tenDiaDiem: string
  tinhThanh?: string | null
  quocGia: string
  moTa?: string | null
  trangThai: AdminDiaDiemStatus
}

export interface AdminCreateVoucherPayload {
  maVoucher: string
  tenVoucher: string
  tourId?: number | null
  kieuGiam: AdminVoucherDiscountType
  giaTriGiam: number
  giamToiDa?: number | null
  donHangToiThieu: number
  ngayBatDau: string
  ngayKetThuc: string
  soLuongToiDa: number
  moTa?: string | null
  trangThai?: AdminVoucherStatus
}

export interface AdminUpdateVoucherPayload extends AdminCreateVoucherPayload {
  soLuongDaDung: number
  trangThai: AdminVoucherStatus
}

export interface AdminCreateLichKhoiHanhPayload {
  tourId: number
  maDotTour: string
  ngayKhoiHanh: string
  ngayKetThuc: string
  noiTapTrung?: string | null
  soChoToiDa: number
  ghiChu?: string | null
  lyDoHuy?: string | null
  trangThai?: AdminLichKhoiHanhStatus
}

export interface AdminUpdateLichKhoiHanhPayload extends AdminCreateLichKhoiHanhPayload {
  trangThai: AdminLichKhoiHanhStatus
}

export interface AdminCreateLichTrinhPayload {
  tourId: number
  ngayThu: number
  thuTuTrongNgay: number
  gioBatDau?: string | null
  gioKetThuc?: string | null
  tieuDe?: string | null
  noiDung?: string | null
  diaDiemId?: number | null
}

export interface AdminUpdateLichTrinhPayload extends AdminCreateLichTrinhPayload {}

export interface AdminCreateTinTucPayload {
  tieuDe: string
  slug: string
  tomTat?: string | null
  noiDung: string
  anhDaiDien?: string | null
  danhMuc?: string | null
  ngayDang?: string | null
  trangThai?: AdminTinTucStatus
}

export interface AdminUpdateTinTucPayload {
  tieuDe: string
  slug: string
  tomTat?: string | null
  noiDung: string
  anhDaiDien?: string | null
  danhMuc?: string | null
  ngayDang: string
  trangThai: AdminTinTucStatus
}

export interface AdminUpdateReviewStatusPayload {
  trangThai: AdminReviewDisplayStatus
  phanHoiAdmin?: string | null
}
