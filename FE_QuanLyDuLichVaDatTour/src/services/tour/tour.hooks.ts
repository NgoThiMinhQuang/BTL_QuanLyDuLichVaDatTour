import { useQuery } from '@tanstack/react-query'
import type { SearchTourParams } from '../../types/tour'
import { layDiaDiem, layLoaiTour, layTourNoiBat, timTours } from './tour.api'

export function useTourNoiBat(limit?: number) {
  const resolvedLimit = limit === undefined ? undefined : limit

  return useQuery({
    queryKey: ['tour', 'featured-tours', resolvedLimit ?? 'all'],
    queryFn: () => layTourNoiBat(resolvedLimit),
  })
}

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
