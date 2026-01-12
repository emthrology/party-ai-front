/**
 * 표준화된 API 응답 타입 정의
 * 모든 API 응답은 이 구조를 따릅니다.
 */

export interface ApiError {
  code: string
  message: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
}
