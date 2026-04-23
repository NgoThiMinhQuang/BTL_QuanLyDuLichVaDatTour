import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { anTourQuanTri, capNhatTrangThaiTourQuanTri, layDanhSachBookingQuanTri, layDanhSachTourQuanTri } from './admin.api'
import type { AdminTourStatus } from '../../types/admin'

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

export function useUpdateAdminTourStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, trangThai }: { id: number; trangThai: AdminTourStatus }) => capNhatTrangThaiTourQuanTri(id, trangThai),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] })
    },
  })
}

export function useHideAdminTour() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => anTourQuanTri(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin', 'tours'] })
    },
  })
}
