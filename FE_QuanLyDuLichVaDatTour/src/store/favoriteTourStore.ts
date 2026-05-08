import { create } from 'zustand'
import type { FeaturedTourApiItem } from '../types/tour'
import { layDanhSachYeuThich, themYeuThich, xoaYeuThich } from '../services/yeu-thich/yeuThich'
import { useAuthStore } from './authStore'

const FAVORITE_TOURS_KEY = 'travelviet.favoriteTours'
const FAVORITE_IDS_KEY = 'travelviet.favoriteIds'

interface FavoriteTourState {
  favoriteTours: FeaturedTourApiItem[]
  favoriteIds: Set<number>
  isFavorite: (tourId: number) => boolean
  toggleFavorite: (tour: FeaturedTourApiItem) => void
  removeFavorite: (tourId: number) => void
  syncFromApi: () => Promise<void>
}

function readFavoriteTours(): FeaturedTourApiItem[] {
  try {
    const value = localStorage.getItem(FAVORITE_TOURS_KEY)
    if (!value) return []
    const tours = JSON.parse(value)
    return Array.isArray(tours) ? tours : []
  } catch {
    return []
  }
}

function readFavoriteIds(): Set<number> {
  try {
    const value = localStorage.getItem(FAVORITE_IDS_KEY)
    if (!value) return new Set()
    const ids = JSON.parse(value)
    return new Set(Array.isArray(ids) ? ids : [])
  } catch {
    return new Set()
  }
}

function writeFavoriteTours(tours: FeaturedTourApiItem[]) {
  localStorage.setItem(FAVORITE_TOURS_KEY, JSON.stringify(tours))
}

function writeFavoriteIds(ids: Set<number>) {
  localStorage.setItem(FAVORITE_IDS_KEY, JSON.stringify([...ids]))
}

export const useFavoriteTourStore = create<FavoriteTourState>((set, get) => ({
  favoriteTours: readFavoriteTours(),
  favoriteIds: readFavoriteIds(),
  isFavorite: (tourId) => get().favoriteIds.has(tourId),
  toggleFavorite: (tour) => {
    const currentIds = get().favoriteIds
    const currentTours = get().favoriteTours
    const nextIds = new Set(currentIds)
    let nextTours: FeaturedTourApiItem[]

    if (currentIds.has(tour.id)) {
      nextIds.delete(tour.id)
      nextTours = currentTours.filter((item) => item.id !== tour.id)
    } else {
      nextIds.add(tour.id)
      nextTours = [tour, ...currentTours]
    }

    writeFavoriteIds(nextIds)
    writeFavoriteTours(nextTours)
    set({ favoriteIds: nextIds, favoriteTours: nextTours })

    const token = useAuthStore.getState().accessToken
    if (token) {
      if (!currentIds.has(tour.id)) {
        themYeuThich(tour.id).catch(() => {})
      } else {
        xoaYeuThich(tour.id).catch(() => {})
      }
    }
  },
  removeFavorite: (tourId) => {
    const nextIds = new Set(get().favoriteIds)
    nextIds.delete(tourId)
    const nextTours = get().favoriteTours.filter((tour) => tour.id !== tourId)

    writeFavoriteIds(nextIds)
    writeFavoriteTours(nextTours)
    set({ favoriteIds: nextIds, favoriteTours: nextTours })

    const token = useAuthStore.getState().accessToken
    if (token) {
      xoaYeuThich(tourId).catch(() => {})
    }
  },
  syncFromApi: async () => {
    const token = useAuthStore.getState().accessToken
    if (!token) return

    try {
      const apiItems = await layDanhSachYeuThich()
      const ids = new Set(apiItems.map((x) => x.tourId))
      const tours: FeaturedTourApiItem[] = apiItems.map((x) => ({
        id: x.tourId,
        maTour: x.maTour,
        tenTour: x.tenTour,
        loaiTourId: 0,
        tenLoaiTour: x.tenLoaiTour,
        diemXuatPhatId: 0,
        tenDiaDiemKhoiHanh: '',
        soNgay: x.soNgay,
        soDem: x.soDem,
        phuongTien: null,
        moTaNgan: null,
        giaNguoiLonMacDinh: null,
        giaTreEmMacDinh: null,
        averageRating: 0,
        totalReviews: 0,
        soChoConLai: 0,
        ngayKhoiHanhGanNhat: null,
        giaThapNhat: x.giaTuThamKhao,
        diemDens: [],
        anhTours: x.anhDaiDien
          ? [{ id: 0, linkAnh: x.anhDaiDien, moTa: null, isAvatar: true, thuTu: 0 }]
          : [],
        trangThai: x.trangThai,
      }))

      writeFavoriteIds(ids)
      writeFavoriteTours(tours)
      set({ favoriteIds: ids, favoriteTours: tours })
    } catch {
      // API sync failed — keep localStorage state
    }
  },
}))