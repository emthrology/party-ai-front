// 간단한 JWT 생성 및 검증 유틸리티
// 실제 프로덕션에서는 서버에서만 JWT를 생성해야 합니다

interface JWTPayload {
  userId: string
  email: string
  exp: number
  iat: number
}

const SECRET = 'your-secret-key-change-in-production'

// Base64 URL 인코딩
function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

// Base64 URL 디코딩
function base64UrlDecode(str: string): string {
  str = str.replace(/-/g, '+').replace(/_/g, '/')
  while (str.length % 4) {
    str += '='
  }
  return atob(str)
}

// 간단한 HMAC 시뮬레이션 (실제로는 crypto API 사용 권장)
function simpleHash(data: string): string {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 32bit 정수로 변환
  }
  return Math.abs(hash).toString(16)
}

// JWT 토큰 생성
export function generateToken(payload: Omit<JWTPayload, 'exp' | 'iat'>): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }

  const now = Math.floor(Date.now() / 1000)
  const jwtPayload: JWTPayload = {
    ...payload,
    iat: now,
    exp: now + (7 * 24 * 60 * 60) // 7일
  }

  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(jwtPayload))
  const signature = simpleHash(`${encodedHeader}.${encodedPayload}.${SECRET}`)

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

// JWT 토큰 검증
export function verifyToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const [encodedHeader, encodedPayload, signature] = parts
    const expectedSignature = simpleHash(`${encodedHeader}.${encodedPayload}.${SECRET}`)

    if (signature !== expectedSignature) {
      return null
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JWTPayload

    // 만료 시간 확인
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch (error) {
    return null
  }
}

// 토큰에서 페이로드 추출 (검증 없이)
export function decodeToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    const payload = JSON.parse(base64UrlDecode(parts[1])) as JWTPayload
    return payload
  } catch (error) {
    return null
  }
}

