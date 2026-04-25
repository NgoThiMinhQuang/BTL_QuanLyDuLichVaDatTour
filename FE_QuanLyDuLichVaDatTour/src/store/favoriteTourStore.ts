import { create } from 'zustand'
import type { FeaturedTourApiItem } from '../types/tour'

const FAVORITE_TOURS_KEY = 'travelviet.favoriteTours'

interface FavoriteTourState {
  favoriteTours: FeaturedTourApiItem[]
  isFavorite: (tourId: number) => boolean
  toggleFavorite: (tour: FeaturedTourApiItem) => void
  removeFavorite: (tourId: number) => void
}

function readFavoriteTours(): FeaturedTourApiItem[] {
  try {
    const value = localStorage.getItem(FAVORITE_TOURS_KEY)
    if (!value) {
      return []
    }

    const tours = JSON.parse(value)
    return Array.isArray(tours) ? tours : []
  } catch {
    return []
  }
}

function writeFavoriteTours(tours: FeaturedTourApiItem[]) {
  localStorage.setItem(FAVORITE_TOURS_KEY, JSON.stringify(tours))
}

export const useFavoriteTourStore = create<FavoriteTourState>((set, get) => ({
  favoriteTours: readFavoriteTours(),
  isFavorite: (tourId) => get().favoriteTours.some((tour) => tour.id === tourId),
  toggleFavorite: (tour) => {
    const currentTours = get().favoriteTours
    const nextTours = currentTours.some((item) => item.id === tour.id)
      ? currentTours.filter((item) => item.id !== tour.id)
      : [tour, ...currentTours]

    writeFavoriteTours(nextTours)
    set({ favoriteTours: nextTours })
  },
  removeFavorite: (tourId) => {
    const nextTours = get().favoriteTours.filter((tour) => tour.id !== tourId)
    writeFavoriteTours(nextTours)
    set({ favoriteTours: nextTours })
  },
}))
