import { useQuery } from '@tanstack/react-query'
import { layTourNoiBat } from './layTourNoiBat'

export function useTourNoiBat(limit = 6) {
  return useQuery({
    queryKey: ['home', 'featured-tours', limit],
    queryFn: () => layTourNoiBat(limit),
  })
}
