import { useQuery } from '@tanstack/react-query'
import { layDiaDiem } from './layDiaDiem'

export function useDiaDiem() {
  return useQuery({
    queryKey: ['tour', 'dia-diem'],
    queryFn: layDiaDiem,
  })
}
