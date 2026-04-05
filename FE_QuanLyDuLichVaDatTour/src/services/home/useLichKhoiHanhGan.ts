import { useQuery } from '@tanstack/react-query'
import type { FeaturedTourApiItem } from '../../types/tour'
import { layLichKhoiHanhGan } from './layLichKhoiHanhGan'

export function useLichKhoiHanhGan(tours: FeaturedTourApiItem[]) {
  return useQuery({
    queryKey: ['home', 'upcoming-departures', tours.map((tour) => tour.id)],
    queryFn: () => layLichKhoiHanhGan(tours),
    enabled: tours.length > 0,
  })
}
