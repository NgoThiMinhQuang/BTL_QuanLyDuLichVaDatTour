import { API_BASE_URL } from '../../constants/api'
import type {
  DepartureItem,
  DeparturePricingItem,
  TourDetailApiItem,
  TourDestinationItem,
  TourItineraryItem,
} from '../../types/tour'

interface RawAnhTour {
  id: number
  linkAnh: string
  moTa?: string | null
  isAvatar: boolean
  thuTu: number
}

interface RawTourDestination {
  id: number
  diaDiemId: number
  tenDiaDiem: string
  tinhThanh?: string | null
  quocGia: string
  thuTu: number
  ghiChu?: string | null
}

interface RawTourDetail {
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
  moTaNgan?: string | null
  moTaChiTiet?: string | null
  dieuKienTour?: string | null
  giaTuThamKhao?: number | null
  averageRating?: number | null
  totalReviews?: number | null
  diemDens?: RawTourDestination[] | null
  anhTours?: RawAnhTour[] | null
  trangThai: string
}

interface RawItineraryItem {
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

interface RawDepartureItem {
  id: number
  tourId: number
  maTour: string
  tenTour: string
  maDotTour: string
  ngayKhoiHanh: string
  ngayKetThuc: string
  noiTapTrung?: string | null
  soChoToiDa: number
  soChoDaDat?: number
  soChoConLai?: number
  trangThai: string
}

interface RawDeparturePricing {
  lichKhoiHanhId: number
  giaNguoiLonNgayThuong?: number | null
  giaTreEmNgayThuong?: number | null
  giaEmBeNgayThuong?: number | null
  giaNguoiLonCuoiTuan?: number | null
  giaTreEmCuoiTuan?: number | null
  giaEmBeCuoiTuan?: number | null
}

function mapDestination(item: RawTourDestination): TourDestinationItem {
  return {
    id: item.id,
    diaDiemId: item.diaDiemId,
    tenDiaDiem: item.tenDiaDiem,
    tinhThanh: item.tinhThanh ?? null,
    quocGia: item.quocGia,
    thuTu: item.thuTu,
    ghiChu: item.ghiChu ?? null,
  }
}
// chuyển dữ liệu chi tiết tour thô từ Backend sang format FE cần.
function mapTourDetail(item: RawTourDetail): TourDetailApiItem {
  return {
    id: item.id,
    maTour: item.maTour,
    tenTour: item.tenTour,
    loaiTourId: item.loaiTourId,
    tenLoaiTour: item.tenLoaiTour,
    diemXuatPhatId: item.diemXuatPhatId,
    tenDiaDiemKhoiHanh: item.tenDiemXuatPhat,
    soNgay: item.soNgay,
    soDem: item.soDem,
    phuongTien: item.phuongTien ?? null,
    moTaNgan: item.moTaNgan ?? null,
    moTaChiTiet: item.moTaChiTiet ?? null,
    dieuKienTour: item.dieuKienTour ?? null,
    giaNguoiLonMacDinh: item.giaTuThamKhao ?? null,
    giaTreEmMacDinh: null,
    averageRating: item.averageRating ?? 0,
    totalReviews: item.totalReviews ?? 0,
    diemDens: (item.diemDens ?? []).map(mapDestination),
    anhTours: (item.anhTours ?? []).map((anh) => ({
      id: anh.id,
      linkAnh: anh.linkAnh,
      moTa: anh.moTa ?? null,
      isAvatar: anh.isAvatar,
      thuTu: anh.thuTu,
    })),
    trangThai: item.trangThai,
  }
}

function mapItinerary(item: RawItineraryItem): TourItineraryItem {
  return {
    id: item.id,
    tourId: item.tourId,
    ngayThu: item.ngayThu,
    thuTuTrongNgay: item.thuTuTrongNgay,
    gioBatDau: item.gioBatDau ?? null,
    gioKetThuc: item.gioKetThuc ?? null,
    tieuDe: item.tieuDe ?? null,
    noiDung: item.noiDung ?? null,
    diaDiemId: item.diaDiemId ?? null,
    tenDiaDiem: item.tenDiaDiem ?? null,
  }
}

function mapDeparture(item: RawDepartureItem): DepartureItem {
  return {
    id: item.id,
    tourId: item.tourId,
    maTour: item.maTour,
    tenTour: item.tenTour,
    maDotTour: item.maDotTour,
    ngayKhoiHanh: item.ngayKhoiHanh,
    ngayKetThuc: item.ngayKetThuc,
    noiTapTrung: item.noiTapTrung ?? null,
    soChoToiDa: item.soChoToiDa,
    soChoDaDat: item.soChoDaDat ?? Math.max(item.soChoToiDa - (item.soChoConLai ?? item.soChoToiDa), 0),
    soChoConLai: item.soChoConLai ?? item.soChoToiDa,
    trangThai: item.trangThai,
  }
}

function mapPricing(item: RawDeparturePricing): DeparturePricingItem {
  return {
    lichKhoiHanhId: item.lichKhoiHanhId,
    giaNguoiLonNgayThuong: item.giaNguoiLonNgayThuong ?? null,
    giaTreEmNgayThuong: item.giaTreEmNgayThuong ?? null,
    giaEmBeNgayThuong: item.giaEmBeNgayThuong ?? null,
    giaNguoiLonCuoiTuan: item.giaNguoiLonCuoiTuan ?? null,
    giaTreEmCuoiTuan: item.giaTreEmCuoiTuan ?? null,
    giaEmBeCuoiTuan: item.giaEmBeCuoiTuan ?? null,
  }
}
// gọi API lấy thông tin chi tiết 1 tour theo id
export async function layTourChiTiet(id: number): Promise<TourDetailApiItem> {
  const response = await fetch(`${API_BASE_URL}/tour/get-by-id/${id}`)

  if (!response.ok) {
    throw new Error('Không thể tải chi tiết tour')
  }

  const data = (await response.json()) as RawTourDetail
  return mapTourDetail(data)  
}

export async function layLichTrinhTour(id: number): Promise<TourItineraryItem[]> {
  const response = await fetch(`${API_BASE_URL}/lich-trinh/get-by-tour/${id}`)

  if (!response.ok) {
    throw new Error('Không thể tải lịch trình tour')
  }
// chuẩn hóa từng hoạt động trong lịch trình để Frontend dễ sử dụng hơn.
  const data = (await response.json()) as RawItineraryItem[]
  return data.map(mapItinerary)
}

export async function layLichKhoiHanhTour(id: number): Promise<DepartureItem[]> {
  const response = await fetch(`${API_BASE_URL}/lich-khoi-hanh/get-by-tour/${id}`)

  if (response.status === 404 || response.status === 204) {
    return []
  }

  if (!response.ok) {
    throw new Error('Không thể tải lịch khởi hành tour')
  }

  const data = (await response.json()) as RawDepartureItem[]
  return data.map(mapDeparture)
}

export async function layBangGiaLichKhoiHanh(id: number): Promise<DeparturePricingItem> {
  const response = await fetch(`${API_BASE_URL}/lich-khoi-hanh/${id}/bang-gia`)

  if (!response.ok) {
    throw new Error('Không thể tải bảng giá lịch khởi hành')
  }

  const data = (await response.json()) as RawDeparturePricing
  return mapPricing(data)
}
