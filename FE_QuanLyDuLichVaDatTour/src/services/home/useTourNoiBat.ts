import { useQuery } from '@tanstack/react-query'
import { layTourNoiBat } from './layTourNoiBat'

export function useTourNoiBat(limit?: number) {
  const resolvedLimit = limit === undefined ? undefined : limit

  return useQuery({
    queryKey: ['home', 'featured-tours', resolvedLimit ?? 'all'],
    queryFn: () => layTourNoiBat(resolvedLimit),
  })
}
