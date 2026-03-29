const envApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim()
const envAssetBaseUrl = import.meta.env.VITE_ASSET_BASE_URL?.trim()

export const API_BASE_URL = envApiBaseUrl && envApiBaseUrl.length > 0 ? envApiBaseUrl : '/gateway'
export const ASSET_BASE_URL = envAssetBaseUrl && envAssetBaseUrl.length > 0 ? envAssetBaseUrl.replace(/\/$/, '') : ''

export function resolveApiAssetUrl(path?: string | null) {
  if (!path) {
    return undefined
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (normalizedPath.startsWith('/images/')) {
    return normalizedPath
  }

  if (ASSET_BASE_URL) {
    return `${ASSET_BASE_URL}${normalizedPath}`
  }

  return normalizedPath
}
