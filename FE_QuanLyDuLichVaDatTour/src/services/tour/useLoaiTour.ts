import { useQuery } from '@tanstack/react-query'
import { layLoaiTour } from './layLoaiTour'

export function useLoaiTour() {
  return useQuery({
    queryKey: ['tour', 'tour-categories'],
    queryFn: layLoaiTour,
  })
}
