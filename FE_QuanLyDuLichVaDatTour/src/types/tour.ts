export interface TourCategory {
  id: number
  ten: string
  moTa: string
  trangThai: string
}

export interface DiaDiemItem {
  id: number
  tenDiaDiem: string
  tinhThanh?: string | null
  quocGia: string
  moTa?: string | null
  trangThai: string
}

export interface TourImageItem {
  id: number
  linkAnh: string
  moTa?: string | null
  isAvatar: boolean
  thuTu: number
}

export interface FeaturedTourApiItem {
  id: number
  maTour: string
  tenTour: string
  loaiTourId: number
  tenLoaiTour: string
  diemXuatPhatId: number
  tenDiaDiemKhoiHanh: string
  soNgay: number
  soDem: number
  phuongTien?: string | null
  moTaNgan?: string | null
  giaNguoiLonMacDinh: number | null
  giaTreEmMacDinh: number | null
  averageRating: number
  totalReviews: number
  soChoConLai: number
  ngayKhoiHanhGanNhat?: string | null
  giaThapNhat?: number | null
  diemDens: TourDestinationItem[]
  anhTours: TourImageItem[]
  trangThai: string
}

export interface SearchTourParams {
  keyword?: string
  diemXuatPhatId?: number
  loaiTourIds?: number[]
  phuongTiens?: string[]
  minPrice?: number
  maxPrice?: number
  minSoNgay?: number
  maxSoNgay?: number
  minRating?: number
}

export interface TourDestinationItem {
  id: number
  diaDiemId: number
  tenDiaDiem: string
  tinhThanh?: string | null
  quocGia: string
  thuTu: number
  ghiChu?: string | null
}

export interface TourDetailApiItem {
  id: number
  maTour: string
  tenTour: string
  loaiTourId: number
  tenLoaiTour: string
  diemXuatPhatId: number
  tenDiaDiemKhoiHanh: string
  soNgay: number
  soDem: number
  phuongTien?: string | null
  moTaNgan?: string | null
  moTaChiTiet?: string | null
  dieuKienTour?: string | null
  giaNguoiLonMacDinh: number | null
  giaTreEmMacDinh: number | null
  averageRating: number
  totalReviews: number
  diemDens: TourDestinationItem[]
  anhTours: TourImageItem[]
  trangThai: string
}

export interface TourItineraryItem {
  id: number
  tourId: number
  ngayThu: number
  thuTuTrongNgay: number
  gioBatDau?: string | null
  gioKetThuc?: string | null
  tieuDe?: string | null
  noiDung?: string | null
  diaDiemId?: number | null
  tenDiaDiem?: string | null
}

export interface DepartureItem {
  id: number
  tourId: number
  maTour: string
  tenTour: string
  maDotTour: string
  ngayKhoiHanh: string
  ngayKetThuc: string
  noiTapTrung?: string | null
  soChoToiDa: number
  soChoDaDat: number
  soChoConLai: number
  trangThai: string
}

export interface DeparturePricingItem {
  lichKhoiHanhId: number
  giaNguoiLonNgayThuong?: number | null
  giaTreEmNgayThuong?: number | null
  giaEmBeNgayThuong?: number | null
  giaNguoiLonCuoiTuan?: number | null
  giaTreEmCuoiTuan?: number | null
  giaEmBeCuoiTuan?: number | null
}

export interface TourGalleryItem {
  id: number
  imageUrl: string
  alt: string
  isAvatar: boolean
}

export interface TourInfoFact {
  key: string
  label: string
  value: string
}
