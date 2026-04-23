import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  anTourQuanTri,
  capNhatTrangThaiTourQuanTri,
  layDanhSachBookingQuanTri,
  layDanhSachTourQuanTri,
  layDiaDiemQuanTri,
  layLoaiTourQuanTri,
  layTongQuanQuanTri,
} from './admin.api'
import type { AdminTourStatus } from '../../types/admin'

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

export function useAdminBookings() {
  return useQuery({
    queryKey: ['admin', 'bookings'],
    queryFn: layDanhSachBookingQuanTri,
  })
}

export function useAdminLoaiTours() {
  return useQuery({
    queryKey: ['admin', 'loai-tour'],
    queryFn: layLoaiTourQuanTri,
  })
}

export function useAdminDiaDiems() {
  return useQuery({
    queryKey: ['admin', 'dia-diem'],
    queryFn: layDiaDiemQuanTri,
  })
}

export function useUpdateAdminTourStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, trangThai }: { id: number; trangThai: AdminTourStatus }) => capNhatTrangThaiTourQuanTri(id, trangThai),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'summary'] }),
      ])
    },
  })
}

export function useHideAdminTour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => anTourQuanTri(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] }),
        queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard', 'summary'] }),
      ])
    },
  })
}
