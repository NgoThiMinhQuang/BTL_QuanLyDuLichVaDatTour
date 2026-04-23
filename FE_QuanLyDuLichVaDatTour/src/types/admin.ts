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
