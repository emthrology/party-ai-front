/**
 * JWT 관련 타입 정의
 */

export interface JWTPayload {
  userId: string
  email: string
  exp: number
  iat: number
}

