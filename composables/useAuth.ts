import { decodeToken, verifyToken } from '~/utils/jwt'

interface User {
  id: string
  email: string
  name: string
}

export const useAuth = () => {
  const token = useCookie<string | null>('auth_token', {
    default: () => null,
    maxAge: 60 * 60 * 24 * 7 // 7일
  })

  const user = useState<User | null>('auth_user', () => null)

  // 토큰에서 사용자 정보 추출
  const setToken = (newToken: string) => {
    token.value = newToken
    const payload = decodeToken(newToken)
    if (payload) {
      // 실제로는 /api/auth/me를 호출해서 사용자 정보를 가져와야 함
      user.value = {
        id: payload.userId,
        email: payload.email,
        name: payload.email?.split('@')[0] || 'User' // 임시로 이메일에서 이름 추출
      }
    }
  }

  // 로그인
  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch<{
        success: boolean
        token: string
        user: User
      }>('/api/auth/login', {
        method: 'POST',
        body: {
          email,
          password
        }
      })

      if (response.success && response.token) {
        setToken(response.token)
        return { success: true, user: response.user }
      }

      return { success: false, error: '로그인에 실패했습니다.' }
    } catch (error: unknown) {
      const err = error as { data?: { error?: string } }
      return {
        success: false,
        error: err?.data?.error || '로그인에 실패했습니다.'
      }
    }
  }

  // 현재 사용자 정보 가져오기
  const fetchUser = async () => {
    if (!token.value) {
      return null
    }

    try {
      const userData = await $fetch<User>('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      user.value = userData
      return userData
    } catch {
      // 토큰이 유효하지 않으면 삭제
      logout()
      return null
    }
  }

  // 로그아웃
  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
        headers: token.value ? {
          Authorization: `Bearer ${token.value}`
        } : {}
      })
    } catch {
      // 에러가 나도 토큰은 삭제
    } finally {
      token.value = null
      user.value = null
    }
  }

  // 토큰 유효성 검증
  const verifyAuth = () => {
    if (!token.value) {
      return false
    }
    
    const payload = verifyToken(token.value)
    if (!payload) {
      // 토큰이 유효하지 않으면 삭제
      token.value = null
      user.value = null
      return false
    }
    
    return true
  }

  // 인증 여부 확인 (토큰 유효성도 함께 확인)
  const isAuthenticated = computed(() => {
    if (!token.value || !user.value) {
      return false
    }
    return verifyAuth()
  })

  // 초기화 시 토큰이 있으면 사용자 정보 가져오기
  if (token.value && !user.value) {
    fetchUser()
  }

  return {
    token: readonly(token),
    user: readonly(user),
    isAuthenticated,
    login,
    logout,
    fetchUser,
    verifyAuth
  }
}

