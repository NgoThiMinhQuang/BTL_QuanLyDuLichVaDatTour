import { useQuery } from '@tanstack/react-query'
import { layTourNoiBat } from './layTourNoiBat'

export function useTourNoiBat() {
  return useQuery({
    queryKey: ['home', 'featured-tours'],
    queryFn: layTourNoiBat,
  })
}
