import { useQuery } from '@tanstack/react-query'
import { getTourCategories } from '../api/getTourCategories'

export function useHomeCategories() {
  return useQuery({
    queryKey: ['home', 'tour-categories'],
    queryFn: getTourCategories,
  })
}
