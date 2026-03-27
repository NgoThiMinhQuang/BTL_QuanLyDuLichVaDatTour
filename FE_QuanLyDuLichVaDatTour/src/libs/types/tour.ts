export interface TourCategory {
  id: number
  ten: string
  moTa: string
  trangThai: string
}

export interface FeaturedTourApiItem {
  id: number
  maTour: string
  tenTour: string
  tenLoaiTour: string
  tenDiaDiemKhoiHanh: string
  soNgay: number
  soDem: number
  phuongTien: string | null
  moTaNgan: string | null
  giaNguoiLonMacDinh: number | null
  giaTreEmMacDinh: number | null
  trangThai: string
}

export interface DepartureItem {
  id: number
  tourId: number
  maTour: string
  tenTour: string
  maDotTour: string
  ngayKhoiHanh: string
  ngayKetThuc: string
  noiTapTrung: string | null
  soChoToiDa: number
  trangThai: string
}

export interface BenefitItem {
  id: number
  title: string
  description: string
  icon: string
}

export interface ReviewItem {
  id: number
  name: string
  tour: string
  rating: number
  comment: string
}

export interface HeroStat {
  id: number
  label: string
  value: string
}

export interface SearchSuggestion {
  id: number
  label: string
  value: string
}
