export const PATHS = {
  home: '/',
  about: '/about',
  tour: '/tour',
  tourChiTiet: '/tour/:id',
  favoriteTours: '/tour-yeu-thich',
  lichKhoiHanh: '/lich-khoi-hanh',
  tinTuc: '/tin-tuc',
  tinTucChiTiet: '/tin-tuc/:id',
  lienHe: '/lien-he',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  booking: '/booking',
  myBookings: '/my-bookings',
  myBookingDetail: '/my-bookings/:id',
  myReviews: '/my-reviews',
  admin: '/admin',
  adminTours: '/admin/tours',
  adminBookings: '/admin/bookings',
  adminPayments: '/admin/payments',
  adminReviews: '/admin/reviews',
  adminLoaiTours: '/admin/loai-tour',
  adminDiaDiems: '/admin/dia-diem',
  adminVouchers: '/admin/vouchers',
  adminTinTucs: '/admin/tin-tuc',
  adminLichKhoiHanhs: '/admin/lich-khoi-hanh',
  adminLichTrinhs: '/admin/lich-trinh',
  adminKhachHangs: '/admin/khach-hang',
  adminLienHes: '/admin/lien-he',
  adminHuyTours: '/admin/huy-tour',
  adminAuditLogs: '/admin/audit-log',
  profile: '/profile',
  myVouchers: '/my-vouchers',
} as const

export function getTinTucChiTietPath(id: number | string) {
  return `/tin-tuc/${id}`
}

export function getTourChiTietPath(id: number | string) {
  return `/tour/${id}`
}

export function getBookingDetailPath(id: number | string) {
  return `/my-bookings/${id}`
}

export const BOOKING_DETAIL_PATH = getBookingDetailPath
