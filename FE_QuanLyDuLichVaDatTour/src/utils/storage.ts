export interface StoredUser {
  id: number
  email: string
  hoTen: string
  vaiTro: string
  trangThai: string
}

export function getAccessToken() {
  return localStorage.getItem('accessToken')
}

export function requireAccessToken() {
  const accessToken = getAccessToken()

  if (!accessToken) {
    throw new Error('Vui lòng đăng nhập để tiếp tục')
  }

  return accessToken
}

export function getCurrentUser() {
  const rawUser = localStorage.getItem('currentUser')

  if (!rawUser) {
    return null
  }

  try {
    return JSON.parse(rawUser) as StoredUser
  } catch {
    return null
  }
}

export function setAuthSession(accessToken: string, user: StoredUser) {
  localStorage.setItem('accessToken', accessToken)
  localStorage.setItem('currentUser', JSON.stringify(user))
}

export function clearAuthSession() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('currentUser')
}
