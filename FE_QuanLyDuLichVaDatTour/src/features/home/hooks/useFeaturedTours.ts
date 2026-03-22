import { useQuery } from '@tanstack/react-query'
import { getFeaturedTours } from '../api/getFeaturedTours'

export function useFeaturedTours() {
  return useQuery({
    queryKey: ['home', 'featured-tours'],
    queryFn: getFeaturedTours,
  })
}
