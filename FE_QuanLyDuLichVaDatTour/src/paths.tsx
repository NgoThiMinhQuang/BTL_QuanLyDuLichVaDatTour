export const PATHS = {
  home: '/',
  about: '/about',
  tour: '/tour',
  lichKhoiHanh: '/lich-khoi-hanh',
  tinTuc: '/tin-tuc',
  tinTucChiTiet: '/tin-tuc/:id',
  login: '/login',
  register: '/register',
} as const

export function getTinTucChiTietPath(id: number | string) {
  return `/tin-tuc/${id}`
}
