import { create } from 'zustand'
import { getCurrentUser } from '../services/auth/me'
import type { VaiTroNguoiDung } from '../services/auth/types'

const AUTH_STORAGE_KEY = 'travelviet.auth'

type AuthStorageType = 'local' | 'session'

export interface NguoiDungDangNhap {
  id: number
  email: string
  hoTen: string
  vaiTro: VaiTroNguoiDung
  trangThai: string
}

interface StoredAuthSession {
  accessToken: string
  currentUser: NguoiDungDangNhap
  storageType: AuthStorageType
}

interface AuthState {
  accessToken: string | null
  currentUser: NguoiDungDangNhap | null
  isHydrated: boolean
  isHydrating: boolean
  setAuthSession: (accessToken: string, user: NguoiDungDangNhap, rememberMe?: boolean) => void
  clearAuthSession: () => void
  hydrateAuth: () => Promise<void>
  requireAccessToken: () => string
}

function readStoredSession(): StoredAuthSession | null {
  const localSession = parseStoredSession(localStorage.getItem(AUTH_STORAGE_KEY), 'local')
  if (localSession) {
    return localSession
  }

  return parseStoredSession(sessionStorage.getItem(AUTH_STORAGE_KEY), 'session')
}

function parseStoredSession(value: string | null, storageType: AuthStorageType): StoredAuthSession | null {
  if (!value) {
    return null
  }

  try {
    const session = JSON.parse(value) as Partial<StoredAuthSession>
    if (!session.accessToken || !session.currentUser) {
      return null
    }

    return {
      accessToken: session.accessToken,
      currentUser: session.currentUser,
      storageType,
    }
  } catch {
    return null
  }
}

function writeStoredSession(accessToken: string, currentUser: NguoiDungDangNhap, rememberMe?: boolean) {
  const storage = rememberMe ? localStorage : sessionStorage
  const otherStorage = rememberMe ? sessionStorage : localStorage
  const storageType: AuthStorageType = rememberMe ? 'local' : 'session'

  otherStorage.removeItem(AUTH_STORAGE_KEY)
  storage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      accessToken,
      currentUser,
      storageType,
    }),
  )
}

function clearStoredSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
  sessionStorage.removeItem(AUTH_STORAGE_KEY)
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  currentUser: null,
  isHydrated: false,
  isHydrating: false,
  setAuthSession: (accessToken, user, rememberMe = false) => {
    writeStoredSession(accessToken, user, rememberMe)
    set({ accessToken, currentUser: user, isHydrated: true })
  },
  clearAuthSession: () => {
    clearStoredSession()
    set({ accessToken: null, currentUser: null, isHydrated: true, isHydrating: false })
  },
  hydrateAuth: async () => {
    if (get().isHydrated || get().isHydrating) {
      return
    }

    const storedSession = readStoredSession()
    if (!storedSession) {
      set({ isHydrated: true })
      return
    }

    set({
      accessToken: storedSession.accessToken,
      currentUser: storedSession.currentUser,
      isHydrating: true,
    })

    try {
      const currentUser = await getCurrentUser(storedSession.accessToken)
      const user: NguoiDungDangNhap = {
        id: currentUser.id,
        email: currentUser.email,
        hoTen: currentUser.hoTen,
        vaiTro: currentUser.vaiTro,
        trangThai: currentUser.trangThai,
      }

      writeStoredSession(storedSession.accessToken, user, storedSession.storageType === 'local')
      set({ accessToken: storedSession.accessToken, currentUser: user, isHydrated: true, isHydrating: false })
    } catch {
      clearStoredSession()
      set({ accessToken: null, currentUser: null, isHydrated: true, isHydrating: false })
    }
  },
  requireAccessToken: () => {
    const accessToken = get().accessToken

    if (!accessToken) {
      throw new Error('Vui lòng đăng nhập để tiếp tục')
    }

    return accessToken
  },
}))
