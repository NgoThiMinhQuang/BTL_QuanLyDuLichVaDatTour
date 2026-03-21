export interface TourCategory {
  id: number
  ten: string
  moTa: string
  trangThai: string
}

export interface FeaturedTour {
  id: number
  title: string
  subtitle: string
  duration: string
  transport: string
  location: string
  departure: string
  price: string
  highlight: string
}

export interface BenefitItem {
  id: number
  title: string
  description: string
  icon: string
}

export interface ReviewItem {
  id: number
  name: string
  tour: string
  rating: number
  comment: string
}

export interface HeroStat {
  id: number
  label: string
  value: string
}

export interface SearchSuggestion {
  id: number
  label: string
  value: string
}
