import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { layTatCaTinTuc } from './layTatCaTinTuc'

export const TIN_TUC_PAGE_SIZE = 6

export function useTinTucPage() {
  const [keyword, setKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [page, setPage] = useState(1)

  const query = useQuery({
    queryKey: ['tin-tuc', 'all'],
    queryFn: layTatCaTinTuc,
  })

  const categoryOptions = useMemo(() => {
    const categories = new Set<string>()

    query.data?.forEach((item) => {
      if (item.danhMuc?.trim()) {
        categories.add(item.danhMuc.trim())
      }
    })

    return ['Tất cả', ...Array.from(categories)]
  }, [query.data])

  const filteredItems = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase()

    return (query.data ?? []).filter((item) => {
      const matchesCategory = selectedCategory === 'Tất cả' || item.danhMuc === selectedCategory
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        item.tieuDe.toLowerCase().includes(normalizedKeyword) ||
        (item.tomTat ?? '').toLowerCase().includes(normalizedKeyword)

      return matchesCategory && matchesKeyword
    })
  }, [keyword, query.data, selectedCategory])

  const featuredItem = filteredItems[0]
  const regularItems = featuredItem ? filteredItems.filter((item) => item.id !== featuredItem.id) : filteredItems
  const paginatedItems = regularItems.slice((page - 1) * TIN_TUC_PAGE_SIZE, page * TIN_TUC_PAGE_SIZE)

  return {
    ...query,
    keyword,
    selectedCategory,
    page,
    categoryOptions,
    filteredItems,
    featuredItem,
    regularItems,
    paginatedItems,
    setKeyword,
    setSelectedCategory,
    setPage,
  }
}
