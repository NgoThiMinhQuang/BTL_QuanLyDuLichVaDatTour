import { create } from 'zustand'
import { getCurrentUser } from '../services/auth/me'
import type { VaiTroNguoiDung } from '../services/auth/types'

const AUTH_STORAGE_KEY = 'travelviet.auth'
export const SESSION_EXPIRED_MESSAGE = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'

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
  expiresAt: number | null
}

interface AuthState {
  accessToken: string | null
  currentUser: NguoiDungDangNhap | null
  expiresAt: number | null
  isHydrated: boolean
  isHydrating: boolean
  setAuthSession: (accessToken: string, user: NguoiDungDangNhap, rememberMe?: boolean, expiresInSeconds?: number) => void
  clearAuthSession: () => void
  hydrateAuth: () => Promise<void>
  requireAccessToken: () => string
}

function decodeJwtExpiry(accessToken: string): number | null {
  const payload = accessToken.split('.')[1]
  if (!payload) {
    return null
  }

  try {
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
    const parsed = JSON.parse(atob(padded)) as { exp?: number }
    return typeof parsed.exp === 'number' ? parsed.exp * 1000 : null
  } catch {
    return null
  }
}

function isSessionExpired(accessToken: string, expiresAt: number | null) {
  const expiryMs = expiresAt ?? decodeJwtExpiry(accessToken)
  return expiryMs !== null && Date.now() >= expiryMs
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
      expiresAt: typeof session.expiresAt === 'number' ? session.expiresAt : decodeJwtExpiry(session.accessToken),
    }
  } catch {
    return null
  }
}

function readStoredSession(): StoredAuthSession | null {
  const localSession = parseStoredSession(localStorage.getItem(AUTH_STORAGE_KEY), 'local')
  if (localSession) {
    return localSession
  }

  return parseStoredSession(sessionStorage.getItem(AUTH_STORAGE_KEY), 'session')
}

function writeStoredSession(accessToken: string, currentUser: NguoiDungDangNhap, rememberMe: boolean, expiresAt: number | null) {
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
      expiresAt,
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
  expiresAt: null,
  isHydrated: false,
  isHydrating: false,
  setAuthSession: (accessToken, user, rememberMe = false, expiresInSeconds) => {
    const expiresAt = typeof expiresInSeconds === 'number'
      ? Date.now() + (expiresInSeconds * 1000)
      : decodeJwtExpiry(accessToken)

    writeStoredSession(accessToken, user, rememberMe, expiresAt)
    set({ accessToken, currentUser: user, expiresAt, isHydrated: true, isHydrating: false })
  },
  clearAuthSession: () => {
    clearStoredSession()
    set({ accessToken: null, currentUser: null, expiresAt: null, isHydrated: true, isHydrating: false })
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

    if (isSessionExpired(storedSession.accessToken, storedSession.expiresAt)) {
      get().clearAuthSession()
      return
    }

    set({
      accessToken: storedSession.accessToken,
      currentUser: storedSession.currentUser,
      expiresAt: storedSession.expiresAt,
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

      writeStoredSession(storedSession.accessToken, user, storedSession.storageType === 'local', storedSession.expiresAt)
      set({ accessToken: storedSession.accessToken, currentUser: user, expiresAt: storedSession.expiresAt, isHydrated: true, isHydrating: false })
    } catch {
      clearStoredSession()
      set({ accessToken: null, currentUser: null, expiresAt: null, isHydrated: true, isHydrating: false })
    }
  },
  requireAccessToken: () => {
    const accessToken = get().accessToken
    const expiresAt = get().expiresAt

    if (!accessToken) {
      throw new Error('Vui lòng đăng nhập để tiếp tục')
    }

    if (isSessionExpired(accessToken, expiresAt)) {
      get().clearAuthSession()
      throw new Error(SESSION_EXPIRED_MESSAGE)
    }

    return accessToken
  },
}))
