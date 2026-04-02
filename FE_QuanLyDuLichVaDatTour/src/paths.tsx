export const PATHS = {
  home: '/',
  about: '/about',
  tour: '/tour',
  tourChiTiet: '/tour/:id',
  lichKhoiHanh: '/lich-khoi-hanh',
  tinTuc: '/tin-tuc',
  tinTucChiTiet: '/tin-tuc/:id',
  lienHe: '/lien-he',
  login: '/login',
  register: '/register',
  booking: '/booking',
} as const

export function getTinTucChiTietPath(id: number | string) {
  return `/tin-tuc/${id}`
}

export function getTourChiTietPath(id: number | string) {
  return `/tour/${id}`
}
