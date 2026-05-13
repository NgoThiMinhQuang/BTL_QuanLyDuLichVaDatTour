type StatusMeta = {
  label: string
  color: string
}

export const adminTourStatusMeta = {
  nhap: { label: 'Nháp', color: 'default' },
  dang_mo_ban: { label: 'Đang mở bán', color: 'green' },
  tam_ngung: { label: 'Tạm ngưng', color: 'orange' },
  an: { label: 'Ẩn', color: 'red' },
  ngung_kinh_doanh: { label: 'Ngừng kinh doanh', color: 'volcano' },
} as const satisfies Record<string, StatusMeta>

export const adminBookingStatusMeta = {
  moi_tao: { label: 'Mới tạo', color: 'default' },
  cho_thanh_toan: { label: 'Chờ thanh toán', color: 'gold' },
  da_coc: { label: 'Đã cọc', color: 'cyan' },
  da_xac_nhan: { label: 'Đã xác nhận', color: 'green' },
  da_huy: { label: 'Đã huỷ', color: 'red' },
  hoan_tat: { label: 'Hoàn tất', color: 'blue' },
} as const satisfies Record<string, StatusMeta>

export const adminPaymentStatusMeta = {
  chua_thanh_toan: { label: 'Chưa thanh toán', color: 'default' },
  thanh_toan_mot_phan: { label: 'Thanh toán một phần', color: 'gold' },
  da_thanh_toan_du: { label: 'Đã thanh toán đủ', color: 'green' },
  that_bai: { label: 'Thất bại', color: 'red' },
  da_hoan_tien: { label: 'Đã hoàn tiền', color: 'purple' },
} as const satisfies Record<string, StatusMeta>

export const adminPaymentTransactionStatusMeta = {
  khoi_tao: { label: 'Khởi tạo', color: 'default' },
  cho_xu_ly: { label: 'Chờ xử lý', color: 'processing' },
  thanh_cong: { label: 'Thành công', color: 'green' },
  that_bai: { label: 'Thất bại', color: 'red' },
  da_hoan_tien: { label: 'Đã hoàn tiền', color: 'purple' },
} as const satisfies Record<string, StatusMeta>

export const paymentStatusTextMap: Record<string, string> = {
  chua_thanh_toan: 'Chưa thanh toán',
  thanh_toan_mot_phan: 'Thanh toán một phần',
  da_thanh_toan_du: 'Đã thanh toán đủ',
  that_bai: 'Thất bại',
  da_hoan_tien: 'Đã hoàn tiền',
  cho_thanh_toan: 'Chờ thanh toán',
  thanh_cong: 'Thành công',
  khoi_tao: 'Khởi tạo',
  cho_xu_ly: 'Chờ xử lý',
}

export const bookingStatusTextMap: Record<string, string> = {
  moi_tao: 'Mới tạo',
  cho_thanh_toan: 'Chờ thanh toán',
  da_coc: 'Đã cọc',
  da_xac_nhan: 'Đã xác nhận',
  da_huy: 'Đã huỷ',
  tu_choi: 'Từ chối',
  hoan_tat: 'Hoàn tất',
}

export function formatBookingStatus(value?: string | null) {
  if (!value) return '-'
  return bookingStatusTextMap[value] ?? value
}

export function formatPaymentStatus(value?: string | null) {
  if (!value) return '-'
  return paymentStatusTextMap[value] ?? value
}

export const adminVoucherStatusMeta = {
  hoat_dong: { label: 'Hoạt động', color: 'green' },
  an: { label: 'Ẩn', color: 'red' },
} as const satisfies Record<string, StatusMeta>

export const adminLoaiTourStatusMeta = {
  hoat_dong: { label: 'Hoạt động', color: 'green' },
  an: { label: 'Ẩn', color: 'red' },
} as const satisfies Record<string, StatusMeta>

export const adminDiaDiemStatusMeta = {
  hoat_dong: { label: 'Hoạt động', color: 'green' },
  an: { label: 'Ẩn', color: 'red' },
} as const satisfies Record<string, StatusMeta>

export const adminLichKhoiHanhStatusMeta = {
  mo_ban: { label: 'Mở bán', color: 'green' },
  het_cho: { label: 'Hết chỗ', color: 'gold' },
  da_khoi_hanh: { label: 'Đã khởi hành', color: 'blue' },
  da_ket_thuc: { label: 'Đã kết thúc', color: 'default' },
  da_huy: { label: 'Đã huỷ', color: 'red' },
} as const satisfies Record<string, StatusMeta>

export const adminTinTucStatusMeta = {
  nhap: { label: 'Nháp', color: 'default' },
  hoat_dong: { label: 'Hoạt động', color: 'green' },
  hien_thi: { label: 'Hiển thị', color: 'blue' },
  an: { label: 'Ẩn', color: 'red' },
} as const satisfies Record<string, StatusMeta>

export const adminReviewStatusMeta = {
  cho_duyet: { label: 'Chờ duyệt', color: 'gold' },
  hien_thi: { label: 'Hiển thị', color: 'green' },
  an: { label: 'Ẩn', color: 'red' },
} as const satisfies Record<string, StatusMeta>

export const adminVoucherDiscountTypeMeta = {
  phan_tram: { label: 'Phần trăm', color: 'blue' },
  so_tien: { label: 'Số tiền', color: 'purple' },
} as const satisfies Record<string, StatusMeta>

export const adminPaymentTransactionTypeMeta = {
  dat_coc: { label: 'Đặt cọc', color: 'cyan' },
  thanh_toan_con_lai: { label: 'Thanh toán còn lại', color: 'blue' },
  thanh_toan_toan_bo: { label: 'Thanh toán toàn bộ', color: 'green' },
  hoan_tien: { label: 'Hoàn tiền', color: 'purple' },
} as const satisfies Record<string, StatusMeta>

export const adminPaymentChannelMeta = {
  noi_bo: { label: 'Nội bộ', color: 'default' },
  ben_thu_ba: { label: 'Bên thứ ba', color: 'processing' },
} as const satisfies Record<string, StatusMeta>

export const adminPaymentMethodMeta = {
  tien_mat: { label: 'Tiền mặt', color: 'default' },
  chuyen_khoan: { label: 'Chuyển khoản', color: 'blue' },
  the: { label: 'Thẻ', color: 'cyan' },
  vi_dien_tu: { label: 'Ví điện tử', color: 'purple' },
  cong_thanh_toan: { label: 'Cổng thanh toán', color: 'green' },
} as const satisfies Record<string, StatusMeta>

export function formatDateTime(value?: string | null) {
  if (!value) {
    return '-'
  }

  return new Date(value).toLocaleString('vi-VN')
}

export function toDateInputValue(value?: string | null) {
  if (!value) {
    return undefined
  }

  return new Date(value).toISOString().slice(0, 10)
}

export function toDateTimeLocalValue(value?: string | null) {
  if (!value) {
    return undefined
  }

  const date = new Date(value)
  const timezoneOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

export function toTimeInputValue(value?: string | null) {
  if (!value) {
    return undefined
  }

  return value.slice(0, 5)
}

export function listToTextareaValue(values?: Array<string | null | undefined>) {
  return (values ?? []).filter(Boolean).join('\n')
}

export function textareaToList(value?: string | null) {
  return (value ?? '')
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
}

export function mapStatusOptions(meta: Record<string, StatusMeta>) {
  return Object.entries(meta).map(([value, item]) => ({
    value,
    label: item.label,
  }))
}
