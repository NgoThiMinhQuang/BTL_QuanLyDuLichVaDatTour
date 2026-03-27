import { useQuery } from '@tanstack/react-query'
import { layTatCaLichKhoiHanh } from './layTatCaLichKhoiHanh'

export function useTatCaLichKhoiHanh() {
  return useQuery({
    queryKey: ['schedule', 'all-departures'],
    queryFn: layTatCaLichKhoiHanh,
  })
}