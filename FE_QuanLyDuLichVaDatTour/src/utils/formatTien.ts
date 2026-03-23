export function formatTien(value: number | null) {
  if (value === null) return 'Liên hệ'
  return `${new Intl.NumberFormat('vi-VN').format(value)}đ`
}
