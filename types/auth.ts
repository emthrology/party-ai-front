/**
 * 인증 관련 타입 정의
 */

import type { ApiResponse } from './api'

export interface User {
  id: string
  email: string
  name: string
}

export interface LoginData {
  token: string
  user: User
}

export type LoginResponse = ApiResponse<LoginData>
export type UserResponse = ApiResponse<User>

export interface LoginResult {
  success: boolean
  user?: User
  error?: string
}

