import { useQuery } from '@tanstack/react-query'
import { getUpcomingDepartures } from '../api/getUpcomingDepartures'
import type { FeaturedTourApiItem } from '../types/home'

export function useUpcomingDepartures(tours: FeaturedTourApiItem[]) {
  return useQuery({
    queryKey: ['home', 'upcoming-departures', tours.map((tour) => tour.id)],
    queryFn: () => getUpcomingDepartures(tours),
    enabled: tours.length > 0,
  })
}
