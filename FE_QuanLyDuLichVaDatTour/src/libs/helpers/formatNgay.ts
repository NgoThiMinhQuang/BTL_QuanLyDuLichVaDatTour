export function formatNgay(value: string) {
  return new Date(value).toLocaleDateString('vi-VN')
}
