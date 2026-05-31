import { useQuery } from '@tanstack/react-query'
import type { SearchTourParams } from '../../types/tour'
import { layDiaDiem, layLoaiTour, layTourNoiBat, timTours } from './tour.api'

export function useTourNoiBat(limit?: number) {
  const resolvedLimit = limit === undefined ? undefined : limit
// dùng để gọi API và quản lý dữ liệu sever
  return useQuery({
    queryKey: ['tour', 'featured-tours', resolvedLimit ?? 'all'],
    queryFn: () => layTourNoiBat(resolvedLimit),
  })
}
// hook dùng React Query để lấy danh sách tour theo bộ lọc.
export function useTourSearch(params: SearchTourParams) {
  return useQuery({
    queryKey: ['tour', 'search', params],
    queryFn: () => timTours(params),
  })
}

export function useLoaiTour() {
  return useQuery({
    queryKey: ['tour', 'tour-categories'],
    queryFn: layLoaiTour,
  })
}

export function useDiaDiem() {
  return useQuery({
    queryKey: ['tour', 'dia-diem'],
    queryFn: layDiaDiem,
  })
}
