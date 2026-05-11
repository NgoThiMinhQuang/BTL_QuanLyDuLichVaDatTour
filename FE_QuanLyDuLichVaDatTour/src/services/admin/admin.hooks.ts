import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  anTourQuanTri,
  capNhatDiaDiemQuanTri,
  capNhatLichKhoiHanhQuanTri,
  capNhatLichTrinhQuanTri,
  capNhatLoaiTourQuanTri,
  capNhatTinTucQuanTri,
  capNhatTourQuanTri,
  capNhatTrangThaiBookingQuanTri,
  capNhatTrangThaiDiaDiemQuanTri,
  capNhatTrangThaiKhachHangQuanTri,
  capNhatTrangThaiLichKhoiHanhQuanTri,
  capNhatTrangThaiLienHeQuanTri,
  capNhatTrangThaiLoaiTourQuanTri,
  capNhatTrangThaiPaymentQuanTri,
  capNhatTrangThaiReviewQuanTri,
  capNhatTrangThaiTinTucQuanTri,
  capNhatTrangThaiTourQuanTri,
  capNhatTrangThaiVoucherQuanTri,
  capNhatVoucherQuanTri,
  layChiTietBookingQuanTri,
  layChiTietDiaDiemQuanTri,
  layChiTietKhachHangQuanTri,
  layChiTietLichKhoiHanhQuanTri,
  layChiTietLichTrinhQuanTri,
  layChiTietLienHeQuanTri,
  laySupportTicketsQuanTri,
  layTinNhanHoTroQuanTri,
  layChiTietLoaiTourQuanTri,
  layChiTietPaymentQuanTri,
  layChiTietTinTucQuanTri,
  layChiTietTourQuanTri,
  layChiTietVoucherQuanTri,
  layDanhSachBookingQuanTri,
  layDanhSachDiaDiemQuanTri,
  layDanhSachLichKhoiHanhQuanTri,
  layDanhSachLichTrinhQuanTri,
  layDanhSachLoaiTourQuanTri,
  layDanhSachPaymentQuanTri,
  layDanhSachTinTucQuanTri,
  layDanhSachTourQuanTri,
  layDanhSachVoucherQuanTri,
  layLichKhoiHanhTheoTourQuanTri,
  layLichTrinhTheoTourQuanTri,
  layReviewChoDuyetQuanTri,
  layTatCaReviewQuanTri,
  layTongQuanQuanTri,
  taoDiaDiemQuanTri,
  taoLichKhoiHanhQuanTri,
  taoLichTrinhQuanTri,
  taoLoaiTourQuanTri,
  taoTinTucQuanTri,
  taoTourQuanTri,
  traLoiTinNhanHoTroQuanTri,
  taoVoucherQuanTri,
  timKiemAuditLogQuanTri,
  timKiemKhachHangQuanTri,
  timKiemLienHeQuanTri,
  xoaLichTrinhQuanTri,
} from './admin.api'
import type {
  AdminCreateDiaDiemPayload,
  AdminCreateLichKhoiHanhPayload,
  AdminCreateLichTrinhPayload,
  AdminCreateLoaiTourPayload,
  AdminCreateTinTucPayload,
  AdminCreateTourPayload,
  AdminCreateVoucherPayload,
  AdminDiaDiemStatus,
  AdminKhachHangStatus,
  AdminLienHeStatus,
  AdminLichKhoiHanhStatus,
  AdminLoaiTourStatus,
  AdminPaymentTransactionStatus,
  AdminReviewDisplayStatus,
  AdminSearchAuditLogParams,
  AdminSearchKhachHangParams,
  AdminSearchLienHeParams,
  AdminTinTucStatus,
  AdminTourStatus,
  AdminUpdateBookingStatusPayload,
  AdminUpdateDiaDiemPayload,
  AdminUpdateKhachHangStatusPayload,
  AdminUpdateLichKhoiHanhPayload,
  AdminUpdateLichTrinhPayload,
  AdminUpdateLoaiTourPayload,
  AdminUpdatePaymentStatusPayload,
  AdminUpdateReviewStatusPayload,
  AdminUpdateTinTucPayload,
  AdminUpdateTourPayload,
  AdminUpdateVoucherPayload,
  AdminVoucherStatus,
} from '../../types/admin'

function invalidateAdminShell(queryClient: ReturnType<typeof useQueryClient>) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'summary'] }),
    queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] }),
    queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] }),
    queryClient.invalidateQueries({ queryKey: ['admin', 'payments'] }),
    queryClient.invalidateQueries({ queryKey: ['admin', 'reviews', 'pending'] }),
  ])
}

export function useAdminDashboardSummary() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'summary'],
    queryFn: layTongQuanQuanTri,
  })
}

export function useAdminTours() {
  return useQuery({
    queryKey: ['admin', 'tours'],
    queryFn: layDanhSachTourQuanTri,
  })
}

export function useAdminTour(id?: number) {
  return useQuery({
    queryKey: ['admin', 'tours', id],
    queryFn: () => layChiTietTourQuanTri(id as number),
    enabled: id !== undefined,
  })
}

export function useAdminBookings() {
  return useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: layDanhSachBookingQuanTri,
  })
}

export function useAdminBooking(id?: number) {
  return useQuery({
    queryKey: ['admin', 'bookings', id],
    queryFn: () => layChiTietBookingQuanTri(id as number),
    enabled: id !== undefined,
  })
}

export function useAdminPayments() {
  return useQuery({
    queryKey: ['admin', 'payments'],
    queryFn: layDanhSachPaymentQuanTri,
  })
}

export function useAdminPayment(id?: number) {
  return useQuery({
    queryKey: ['admin', 'payments', id],
    queryFn: () => layChiTietPaymentQuanTri(id as number),
    enabled: id !== undefined,
  })
}

export function useAdminLoaiTours() {
  return useQuery({
    queryKey: ['admin', 'loai-tour'],
    queryFn: layDanhSachLoaiTourQuanTri,
  })
}

export function useAdminLoaiTour(id?: number) {
  return useQuery({
    queryKey: ['admin', 'loai-tour', id],
    queryFn: () => layChiTietLoaiTourQuanTri(id as number),
    enabled: id !== undefined,
  })
}

export function useAdminDiaDiems() {
  return useQuery({
    queryKey: ['admin', 'dia-diem'],
    queryFn: layDanhSachDiaDiemQuanTri,
  })
}

export function useAdminDiaDiem(id?: number) {
  return useQuery({
    queryKey: ['admin', 'dia-diem', id],
    queryFn: () => layChiTietDiaDiemQuanTri(id as number),
    enabled: id !== undefined,
  })
}

export function useAdminVouchers() {
  return useQuery({
    queryKey: ['admin', 'vouchers'],
    queryFn: layDanhSachVoucherQuanTri,
  })
}

export function useAdminVoucher(id?: number) {
  return useQuery({
    queryKey: ['admin', 'vouchers', id],
    queryFn: () => layChiTietVoucherQuanTri(id as number),
    enabled: id !== undefined,
  })
}

export function useAdminLichKhoiHanhs() {
  return useQuery({
    queryKey: ['admin', 'lich-khoi-hanh'],
    queryFn: layDanhSachLichKhoiHanhQuanTri,
  })
}

export function useAdminLichKhoiHanh(id?: number) {
  return useQuery({
    queryKey: ['admin', 'lich-khoi-hanh', id],
    queryFn: () => layChiTietLichKhoiHanhQuanTri(id as number),
    enabled: id !== undefined,
  })
}

export function useAdminLichKhoiHanhByTour(tourId?: number) {
  return useQuery({
    queryKey: ['admin', 'lich-khoi-hanh', 'tour', tourId],
    queryFn: () => layLichKhoiHanhTheoTourQuanTri(tourId as number),
    enabled: tourId !== undefined,
  })
}

export function useAdminLichTrinhs() {
  return useQuery({
    queryKey: ['admin', 'lich-trinh'],
    queryFn: layDanhSachLichTrinhQuanTri,
  })
}

export function useAdminLichTrinh(id?: number) {
  return useQuery({
    queryKey: ['admin', 'lich-trinh', id],
    queryFn: () => layChiTietLichTrinhQuanTri(id as number),
    enabled: id !== undefined,
  })
}

export function useAdminLichTrinhByTour(tourId?: number) {
  return useQuery({
    queryKey: ['admin', 'lich-trinh', 'tour', tourId],
    queryFn: () => layLichTrinhTheoTourQuanTri(tourId as number),
    enabled: tourId !== undefined,
  })
}

export function useAdminTinTucs() {
  return useQuery({
    queryKey: ['admin', 'tin-tuc'],
    queryFn: layDanhSachTinTucQuanTri,
  })
}

export function useAdminTinTuc(id?: number) {
  return useQuery({
    queryKey: ['admin', 'tin-tuc', id],
    queryFn: () => layChiTietTinTucQuanTri(id as number),
    enabled: id !== undefined,
  })
}

export function useAdminPendingReviews(limit = 50) {
  return useQuery({
    queryKey: ['admin', 'reviews', 'pending', limit],
    queryFn: () => layReviewChoDuyetQuanTri(limit),
  })
}

export function useAdminReviews() {
  return useQuery({
    queryKey: ['admin', 'reviews'],
    queryFn: layTatCaReviewQuanTri,
  })
}

export function useCreateAdminTour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminCreateTourPayload) => taoTourQuanTri(payload),
    onSuccess: async () => {
      await invalidateAdminShell(queryClient)
    },
  })
}

export function useUpdateAdminTour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminUpdateTourPayload }) => capNhatTourQuanTri(id, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        invalidateAdminShell(queryClient),
        queryClient.invalidateQueries({ queryKey: ['admin', 'tours', variables.id] }),
      ])
    },
  })
}

export function useUpdateAdminTourStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, trangThai }: { id: number; trangThai: AdminTourStatus }) => capNhatTrangThaiTourQuanTri(id, trangThai),
    onSuccess: async (_, variables) => {
      await Promise.all([
        invalidateAdminShell(queryClient),
        queryClient.invalidateQueries({ queryKey: ['admin', 'tours', variables.id] }),
      ])
    },
  })
}

export function useHideAdminTour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => anTourQuanTri(id),
    onSuccess: async (_, id) => {
      await Promise.all([
        invalidateAdminShell(queryClient),
        queryClient.invalidateQueries({ queryKey: ['admin', 'tours', id] }),
      ])
    },
  })
}

export function useUpdateAdminBookingStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminUpdateBookingStatusPayload }) => capNhatTrangThaiBookingQuanTri(id, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        invalidateAdminShell(queryClient),
        queryClient.invalidateQueries({ queryKey: ['admin', 'bookings', variables.id] }),
      ])
    },
  })
}

export function useUpdateAdminPaymentStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminUpdatePaymentStatusPayload }) => capNhatTrangThaiPaymentQuanTri(id, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        invalidateAdminShell(queryClient),
        queryClient.invalidateQueries({ queryKey: ['admin', 'payments', variables.id] }),
      ])
    },
  })
}

export function useCreateAdminLoaiTour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminCreateLoaiTourPayload) => taoLoaiTourQuanTri(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'loai-tour'] })
    },
  })
}

export function useUpdateAdminLoaiTour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminUpdateLoaiTourPayload }) => capNhatLoaiTourQuanTri(id, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'loai-tour'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'loai-tour', variables.id] }),
      ])
    },
  })
}

export function useUpdateAdminLoaiTourStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, trangThai }: { id: number; trangThai: AdminLoaiTourStatus }) => capNhatTrangThaiLoaiTourQuanTri(id, trangThai),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'loai-tour'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'loai-tour', variables.id] }),
      ])
    },
  })
}

export function useCreateAdminDiaDiem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminCreateDiaDiemPayload) => taoDiaDiemQuanTri(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'dia-diem'] })
    },
  })
}

export function useUpdateAdminDiaDiem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminUpdateDiaDiemPayload }) => capNhatDiaDiemQuanTri(id, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'dia-diem'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'dia-diem', variables.id] }),
      ])
    },
  })
}

export function useUpdateAdminDiaDiemStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, trangThai }: { id: number; trangThai: AdminDiaDiemStatus }) => capNhatTrangThaiDiaDiemQuanTri(id, trangThai),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'dia-diem'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'dia-diem', variables.id] }),
      ])
    },
  })
}

export function useCreateAdminVoucher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminCreateVoucherPayload) => taoVoucherQuanTri(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'vouchers'] })
    },
  })
}

export function useUpdateAdminVoucher() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminUpdateVoucherPayload }) => capNhatVoucherQuanTri(id, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'vouchers'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'vouchers', variables.id] }),
      ])
    },
  })
}

export function useUpdateAdminVoucherStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, trangThai }: { id: number; trangThai: AdminVoucherStatus }) => capNhatTrangThaiVoucherQuanTri(id, trangThai),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'vouchers'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'vouchers', variables.id] }),
      ])
    },
  })
}

export function useCreateAdminLichKhoiHanh() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminCreateLichKhoiHanhPayload) => taoLichKhoiHanhQuanTri(payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'lich-khoi-hanh'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'lich-khoi-hanh', 'tour', variables.tourId] }),
      ])
    },
  })
}

export function useUpdateAdminLichKhoiHanh() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminUpdateLichKhoiHanhPayload }) => capNhatLichKhoiHanhQuanTri(id, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'lich-khoi-hanh'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'lich-khoi-hanh', variables.id] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'lich-khoi-hanh', 'tour', variables.payload.tourId] }),
      ])
    },
  })
}

export function useUpdateAdminLichKhoiHanhStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, trangThai }: { id: number; trangThai: AdminLichKhoiHanhStatus }) => capNhatTrangThaiLichKhoiHanhQuanTri(id, trangThai),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'lich-khoi-hanh'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'lich-khoi-hanh', variables.id] }),
      ])
    },
  })
}

export function useCreateAdminLichTrinh() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminCreateLichTrinhPayload) => taoLichTrinhQuanTri(payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'lich-trinh'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'lich-trinh', 'tour', variables.tourId] }),
      ])
    },
  })
}

export function useUpdateAdminLichTrinh() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminUpdateLichTrinhPayload }) => capNhatLichTrinhQuanTri(id, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'lich-trinh'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'lich-trinh', variables.id] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'lich-trinh', 'tour', variables.payload.tourId] }),
      ])
    },
  })
}

export function useDeleteAdminLichTrinh() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, tourId }: { id: number; tourId?: number }) => xoaLichTrinhQuanTri(id).then(() => ({ tourId })),
    onSuccess: async ({ tourId }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'lich-trinh'] }),
        ...(tourId === undefined ? [] : [queryClient.invalidateQueries({ queryKey: ['admin', 'lich-trinh', 'tour', tourId] })]),
      ])
    },
  })
}

export function useCreateAdminTinTuc() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminCreateTinTucPayload) => taoTinTucQuanTri(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tin-tuc'] })
    },
  })
}

export function useUpdateAdminTinTuc() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminUpdateTinTucPayload }) => capNhatTinTucQuanTri(id, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'tin-tuc'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'tin-tuc', variables.id] }),
      ])
    },
  })
}

export function useUpdateAdminTinTucStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, trangThai }: { id: number; trangThai: AdminTinTucStatus }) => capNhatTrangThaiTinTucQuanTri(id, trangThai),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'tin-tuc'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'tin-tuc', variables.id] }),
      ])
    },
  })
}

export function useUpdateAdminReviewStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminUpdateReviewStatusPayload }) => capNhatTrangThaiReviewQuanTri(id, payload),
    onSuccess: async () => {
      await invalidateAdminShell(queryClient)
    },
  })
}

export function useUpdateAdminReviewDisplayStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, trangThai, phanHoiAdmin }: { id: number; trangThai: AdminReviewDisplayStatus; phanHoiAdmin?: string | null }) =>
      capNhatTrangThaiReviewQuanTri(id, { trangThai, phanHoiAdmin }),
    onSuccess: async () => {
      await invalidateAdminShell(queryClient)
    },
  })
}

export function useAdminKhachHang(params?: AdminSearchKhachHangParams) {
  return useQuery({
    queryKey: ['admin', 'khach-hang', 'search', params],
    queryFn: () => timKiemKhachHangQuanTri(params ?? {}),
  })
}

export function useAdminKhachHangDetail(id?: number) {
  return useQuery({
    queryKey: ['admin', 'khach-hang', id],
    queryFn: () => layChiTietKhachHangQuanTri(id as number),
    enabled: id !== undefined,
  })
}

export function useUpdateAdminKhachHangStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, trangThai }: { id: number; trangThai: AdminKhachHangStatus }) =>
      capNhatTrangThaiKhachHangQuanTri(id, trangThai),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'khach-hang'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'khach-hang', variables.id] }),
      ])
    },
  })
}

export function useAdminLienHe(params?: AdminSearchLienHeParams) {
  return useQuery({
    queryKey: ['admin', 'lien-he', 'search', params],
    queryFn: () => timKiemLienHeQuanTri(params ?? {}),
  })
}

export function useAdminSupportTickets(params?: AdminSearchLienHeParams) {
  return useQuery({
    queryKey: ['admin', 'support-tickets', params],
    queryFn: () => laySupportTicketsQuanTri(params ?? {}),
  })
}

export function useAdminSupportChat(khachHangId?: number) {
  return useQuery({
    queryKey: ['admin', 'support-chat', khachHangId],
    queryFn: () => layTinNhanHoTroQuanTri(khachHangId as number),
    enabled: khachHangId !== undefined,
  })
}

export function useReplyAdminSupportChat() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ khachHangId, noiDung }: { khachHangId: number; noiDung: string }) =>
      traLoiTinNhanHoTroQuanTri(khachHangId, noiDung),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'support-tickets'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'support-chat', variables.khachHangId] }),
      ])
    },
  })
}

export function useAdminLienHeDetail(id?: number) {
  return useQuery({
    queryKey: ['admin', 'lien-he', id],
    queryFn: () => layChiTietLienHeQuanTri(id as number),
    enabled: id !== undefined,
  })
}

export function useUpdateAdminLienHeStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { trangThai: AdminLienHeStatus; phanHoi?: string | null } }) =>
      capNhatTrangThaiLienHeQuanTri(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'lien-he'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'support-tickets'] }),
      ])
    },
  })
}

export function useAdminAuditLog(params?: AdminSearchAuditLogParams) {
  return useQuery({
    queryKey: ['admin', 'audit-log', 'search', params],
    queryFn: () => timKiemAuditLogQuanTri(params ?? {}),
  })
}

// ── TourDiemDen mutations ──

import type { AdminAddTourDiemDenPayload, AdminUpdateTourDiemDenPayload, AdminAddAnhTourPayload, AdminBangGiaLichKhoiHanhPayload } from '../../types/admin'
import {
  themDiemDenTourQuanTri,
  xoaDiemDenTourQuanTri,
  capNhatDiemDenTourQuanTri,
  sapXepDiemDenTourQuanTri,
  themAnhTourQuanTri,
  xoaAnhTourQuanTri,
  datAnhDaiDienTourQuanTri,
  sapXepAnhTourQuanTri,
  capNhatAnhTourQuanTri,
  layBangGiaLichKhoiHanhQuanTri,
  capNhatBangGiaLichKhoiHanhQuanTri,
  xoaBangGiaLichKhoiHanhQuanTri,
} from './admin.api'

export function useAddTourDiemDen() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tourId, payload }: { tourId: number; payload: AdminAddTourDiemDenPayload }) => themDiemDenTourQuanTri(tourId, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tours', variables.tourId] })
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] })
    },
  })
}

export function useDeleteTourDiemDen() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tourDiemDenId: number) => xoaDiemDenTourQuanTri(tourDiemDenId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] })
    },
  })
}

export function useUpdateTourDiemDen() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tourDiemDenId, payload }: { tourDiemDenId: number; payload: AdminUpdateTourDiemDenPayload }) => capNhatDiemDenTourQuanTri(tourDiemDenId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] })
    },
  })
}

export function useReorderTourDiemDen() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tourId, diemDenIds }: { tourId: number; diemDenIds: number[] }) => sapXepDiemDenTourQuanTri(tourId, diemDenIds),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tours', variables.tourId] })
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] })
    },
  })
}

// ── AnhTour mutations ──

export function useAddAnhTour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tourId, payload }: { tourId: number; payload: AdminAddAnhTourPayload }) => themAnhTourQuanTri(tourId, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tours', variables.tourId] })
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] })
    },
  })
}

export function useDeleteAnhTour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (anhTourId: number) => xoaAnhTourQuanTri(anhTourId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] })
    },
  })
}

export function useUpdateAnhTour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ anhTourId, payload }: { anhTourId: number; payload: { moTa?: string | null } }) => capNhatAnhTourQuanTri(anhTourId, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] })
    },
  })
}

export function useSetAvatarAnhTour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (anhTourId: number) => datAnhDaiDienTourQuanTri(anhTourId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] })
    },
  })
}

export function useReorderAnhTour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ tourId, anhTourIds }: { tourId: number; anhTourIds: number[] }) => sapXepAnhTourQuanTri(tourId, anhTourIds),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tours', variables.tourId] })
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] })
    },
  })
}

// ── BangGiaLichKhoiHanh hooks ──

export function useAdminBangGia(lichKhoiHanhId?: number) {
  return useQuery({
    queryKey: ['admin', 'bang-gia', lichKhoiHanhId],
    queryFn: () => layBangGiaLichKhoiHanhQuanTri(lichKhoiHanhId as number),
    enabled: lichKhoiHanhId !== undefined,
  })
}

export function useUpsertBangGiaLichKhoiHanh() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ lichKhoiHanhId, payload }: { lichKhoiHanhId: number; payload: AdminBangGiaLichKhoiHanhPayload }) =>
      capNhatBangGiaLichKhoiHanhQuanTri(lichKhoiHanhId, payload),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'bang-gia', variables.lichKhoiHanhId] })
      await queryClient.invalidateQueries({ queryKey: ['admin', 'lich-khoi-hanh'] })
    },
  })
}

export function useDeleteBangGiaLichKhoiHanh() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (lichKhoiHanhId: number) => xoaBangGiaLichKhoiHanhQuanTri(lichKhoiHanhId),
    onSuccess: async (_, lichKhoiHanhId) => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'bang-gia', lichKhoiHanhId] })
      await queryClient.invalidateQueries({ queryKey: ['admin', 'lich-khoi-hanh'] })
    },
  })
}

// ── Voucher Statistics ──

import { layThongKeVoucherQuanTri, xacNhanThanhToanQuanTri, hoanTienQuanTri, duyetDanhGiaQuanTri, anDanhGiaQuanTri, phanHoiLienHeQuanTri, guiThongBaoHangLoatQuanTri, layDanhSachBookingTheoBoLocQuanTri, xuatBookingExcelQuanTri } from './admin.api'
import type { AdminRefundPayload, AdminBroadcastPayload, AdminBookingFilter } from './admin.api'

export function useAdminVoucherStatistics() {
  return useQuery({
    queryKey: ['admin', 'vouchers', 'statistics'],
    queryFn: layThongKeVoucherQuanTri,
  })
}

export function useAdminConfirmPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ghiChu }: { id: number; ghiChu?: string }) => xacNhanThanhToanQuanTri(id, ghiChu),
    onSuccess: async (_, variables) => {
      await Promise.all([
        invalidateAdminShell(queryClient),
        queryClient.invalidateQueries({ queryKey: ['admin', 'payments', variables.id] }),
      ])
    },
  })
}

export function useAdminRefundPayment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AdminRefundPayload }) => hoanTienQuanTri(id, payload),
    onSuccess: async (_, variables) => {
      await Promise.all([
        invalidateAdminShell(queryClient),
        queryClient.invalidateQueries({ queryKey: ['admin', 'payments', variables.id] }),
      ])
    },
  })
}

export function useAdminApproveReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, phanHoi }: { id: number; phanHoi?: string }) => duyetDanhGiaQuanTri(id, phanHoi),
    onSuccess: async () => {
      await invalidateAdminShell(queryClient)
    },
  })
}

export function useAdminHideReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, phanHoi }: { id: number; phanHoi?: string }) => anDanhGiaQuanTri(id, phanHoi),
    onSuccess: async () => {
      await invalidateAdminShell(queryClient)
    },
  })
}

export function useAdminLienHeReply() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, phanHoi }: { id: number; phanHoi: string }) => phanHoiLienHeQuanTri(id, phanHoi),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'lien-he'] })
    },
  })
}

export function useAdminBroadcastNotification() {
  return useMutation({
    mutationFn: (payload: AdminBroadcastPayload) => guiThongBaoHangLoatQuanTri(payload),
  })
}

export function useAdminFilteredBookings(filter?: AdminBookingFilter) {
  return useQuery({
    queryKey: ['admin', 'bookings', 'filtered', filter],
    queryFn: () => layDanhSachBookingTheoBoLocQuanTri(filter ?? {}),
    enabled: !!filter && (!!filter.status || !!filter.fromDate || !!filter.toDate || !!filter.sortBy),
  })
}
