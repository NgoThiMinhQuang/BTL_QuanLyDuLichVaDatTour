import { useQuery } from '@tanstack/react-query'
import type { SearchTourParams } from '../../libs/types/tour'
import { timTours } from './layTourNoiBat'

export function useTourSearch(params: SearchTourParams) {
  return useQuery({
    queryKey: ['tour', 'search', params],
    queryFn: () => timTours(params),
  })
}
