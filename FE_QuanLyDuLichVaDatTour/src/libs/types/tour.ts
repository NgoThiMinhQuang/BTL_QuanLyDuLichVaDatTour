export interface TourCategory {
  id: number
  ten: string
  moTa: string
  trangThai: string
}

export interface AnhTourItem {
  id: number
  linkAnh: string
  moTa: string | null
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
  phuongTien: string | null
  moTaNgan: string | null
  giaNguoiLonMacDinh: number | null
  giaTreEmMacDinh: number | null
  anhTours: AnhTourItem[]
  trangThai: string
}

export interface TourDestinationItem {
  id: number
  diaDiemId: number
  tenDiaDiem: string
  tinhThanh: string | null
  quocGia: string
  thuTu: number
  ghiChu: string | null
}

export interface TourDetailApiItem extends FeaturedTourApiItem {
  moTaChiTiet: string | null
  dieuKienTour: string | null
  diemDens: TourDestinationItem[]
}

export interface TourItineraryItem {
  id: number
  tourId: number
  ngayThu: number
  thuTuTrongNgay: number
  gioBatDau: string | null
  gioKetThuc: string | null
  tieuDe: string | null
  noiDung: string | null
  diaDiemId: number | null
  tenDiaDiem: string | null
}

export interface DeparturePricingItem {
  lichKhoiHanhId: number
  giaNguoiLonNgayThuong: number | null
  giaTreEmNgayThuong: number | null
  giaEmBeNgayThuong: number | null
  giaNguoiLonCuoiTuan: number | null
  giaTreEmCuoiTuan: number | null
  giaEmBeCuoiTuan: number | null
}

export interface TourDetailSectionTab {
  key: 'tong-quan' | 'lich-trinh' | 'lich-khoi-hanh' | 'gia-tour' | 'dieu-kien'
  label: string
}

export interface TourReviewSummary {
  average: number
  total: number
}

export interface TourReviewDetail {
  id: number
  name: string
  rating: number
  comment: string
  createdAt: string
}

export interface TourInfoFact {
  key: string
  label: string
  value: string
}

export interface TourGalleryItem {
  id: number
  imageUrl: string
  alt: string
  isAvatar: boolean
}

export interface TourScheduleOption {
  id: number
  label: string
  ngayKhoiHanh: string
  ngayKetThuc: string
}

export interface TourDetailPageState {
  detail: TourDetailApiItem
  itinerary: TourItineraryItem[]
  departures: DepartureItem[]
  selectedDeparture: DepartureItem | null
  pricing: DeparturePricingItem | null
}

export interface DiaDiemItem {
  id: number
  tenDiaDiem: string
  tinhThanh: string | null
  quocGia: string
  moTa: string | null
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
