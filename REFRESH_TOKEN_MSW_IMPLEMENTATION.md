# MSW 환경에서 리프레시 토큰 구현 가이드

## ✅ MSW에서 리프레시 토큰 구현 가능

MSW는 네트워크 요청을 모킹하는 도구이므로, 리프레시 토큰 로직도 완전히 모킹할 수 있습니다.

## 구현 구조

### 1. 토큰 타입
- **Access Token**: 짧은 수명 (15분 ~ 1시간), API 인증용
- **Refresh Token**: 긴 수명 (7일 ~ 30일), Access Token 갱신용

### 2. 저장 방식
- **Access Token**: 메모리 또는 일반 쿠키 (선택적)
- **Refresh Token**: httpOnly 쿠키 (보안)

### 3. MSW 핸들러 구현

```typescript
// mocks/handlers.ts

// 리프레시 토큰 저장소 (실제로는 DB에 저장)
const refreshTokens = new Map<string, { userId: string; expiresAt: number }>()

// 로그인: Access Token + Refresh Token 발급
http.post('/api/auth/login', async ({ request }) => {
  const body = await request.json() as { email: string; password: string }
  
  const user = mockUsers.find(
    u => u.email === body.email && u.password === body.password
  )
  
  if (!user) {
    return HttpResponse.json(
      { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
      { status: 401 }
    )
  }
  
  // Access Token 생성 (15분 유효)
  const accessToken = generateToken({
    userId: user.id,
    email: user.email,
    type: 'access'
  }, 15 * 60) // 15분
  
  // Refresh Token 생성 (7일 유효)
  const refreshToken = generateToken({
    userId: user.id,
    email: user.email,
    type: 'refresh'
  }, 7 * 24 * 60 * 60) // 7일
  
  // Refresh Token 저장 (실제로는 DB에 저장)
  refreshTokens.set(refreshToken, {
    userId: user.id,
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000)
  })
  
  // Refresh Token을 httpOnly 쿠키로 설정
  return HttpResponse.json(
    {
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    },
    {
      headers: {
        'Set-Cookie': `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; Path=/`
      }
    }
  )
})

// Access Token 갱신
http.post('/api/auth/refresh', async ({ request, cookies }) => {
  // Refresh Token을 쿠키에서 가져오기
  const refreshToken = cookies.get('refreshToken')
  
  if (!refreshToken) {
    return HttpResponse.json(
      { error: 'Refresh Token이 없습니다.' },
      { status: 401 }
    )
  }
  
  // Refresh Token 검증
  const payload = verifyToken(refreshToken)
  
  if (!payload || payload.type !== 'refresh') {
    return HttpResponse.json(
      { error: '유효하지 않은 Refresh Token입니다.' },
      { status: 401 }
    )
  }
  
  // 저장소에서 Refresh Token 확인
  const storedToken = refreshTokens.get(refreshToken)
  
  if (!storedToken || storedToken.expiresAt < Date.now()) {
    refreshTokens.delete(refreshToken)
    return HttpResponse.json(
      { error: 'Refresh Token이 만료되었습니다.' },
      { status: 401 }
    )
  }
  
  // 새로운 Access Token 생성
  const user = mockUsers.find(u => u.id === payload.userId)
  
  if (!user) {
    return HttpResponse.json(
      { error: '사용자를 찾을 수 없습니다.' },
      { status: 404 }
    )
  }
  
  const newAccessToken = generateToken({
    userId: user.id,
    email: user.email,
    type: 'access'
  }, 15 * 60) // 15분
  
  return HttpResponse.json({
    success: true,
    accessToken: newAccessToken
  })
})

// 로그아웃: Refresh Token 삭제
http.post('/api/auth/logout', async ({ request, cookies }) => {
  const refreshToken = cookies.get('refreshToken')
  
  if (refreshToken) {
    refreshTokens.delete(refreshToken)
  }
  
  return HttpResponse.json(
    { success: true },
    {
      headers: {
        'Set-Cookie': 'refreshToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0; Path=/'
      }
    }
  )
})
```

### 4. 클라이언트 구현

```typescript
// composables/useAuth.ts

export const useAuth = () => {
  // Access Token은 메모리에 저장 (또는 일반 쿠키)
  const accessToken = useState<string | null>('access_token', () => null)
  
  // Refresh Token은 httpOnly 쿠키에 저장 (JavaScript 접근 불가)
  // 따라서 클라이언트에서는 접근하지 않음
  
  const user = useState<User | null>('auth_user', () => null)
  
  // Access Token 갱신
  const refreshAccessToken = async () => {
    try {
      const response = await $fetch<{
        success: boolean
        accessToken: string
      }>('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include' // 쿠키 자동 포함
      })
      
      if (response.success && response.accessToken) {
        accessToken.value = response.accessToken
        return true
      }
      
      return false
    } catch {
      // Refresh Token도 만료되었으면 로그아웃
      await logout()
      return false
    }
  }
  
  // API 호출 시 Access Token 만료 처리
  const fetchWithAuth = async <T>(url: string, options: any = {}): Promise<T> => {
    try {
      return await $fetch<T>(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken.value}`
        }
      })
    } catch (error: any) {
      // 401 에러 (토큰 만료) 시 갱신 시도
      if (error.status === 401 && accessToken.value) {
        const refreshed = await refreshAccessToken()
        
        if (refreshed) {
          // 갱신 성공 시 재시도
          return await $fetch<T>(url, {
            ...options,
            headers: {
              ...options.headers,
              Authorization: `Bearer ${accessToken.value}`
            }
          })
        }
      }
      
      throw error
    }
  }
  
  // 사용자 정보 가져오기
  const fetchUser = async () => {
    try {
      const userData = await fetchWithAuth<User>('/api/auth/me')
      user.value = userData
      return userData
    } catch {
      user.value = null
      return null
    }
  }
  
  // 로그인
  const login = async (email: string, password: string) => {
    const response = await $fetch<{
      success: boolean
      accessToken: string
      user: User
    }>('/api/auth/login', {
      method: 'POST',
      body: { email, password },
      credentials: 'include'
    })
    
    if (response.success) {
      accessToken.value = response.accessToken
      user.value = response.user
      return { success: true, user: response.user }
    }
    
    return { success: false, error: '로그인에 실패했습니다.' }
  }
  
  // 로그아웃
  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch {
      // 에러가 나도 토큰은 삭제
    } finally {
      accessToken.value = null
      user.value = null
    }
  }
  
  return {
    user: readonly(user),
    isAuthenticated: computed(() => !!accessToken.value && !!user.value),
    login,
    logout,
    fetchUser,
    refreshAccessToken
  }
}
```

### 5. JWT 유틸리티 수정

```typescript
// utils/jwt.ts

export function generateToken(
  payload: Omit<JWTPayload, 'exp' | 'iat' | 'type'> & { type?: 'access' | 'refresh' },
  expiresIn: number = 7 * 24 * 60 * 60 // 기본값 7일
): string {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  }
  
  const now = Math.floor(Date.now() / 1000)
  const jwtPayload: JWTPayload & { type?: string } = {
    ...payload,
    type: payload.type || 'access',
    iat: now,
    exp: now + expiresIn
  }
  
  // ... 나머지 로직 동일
}
```

## MSW에서의 장점

### ✅ 완전한 모킹 가능
- 모든 토큰 로직을 MSW 핸들러에서 구현
- 실제 서버와 동일한 동작 시뮬레이션

### ✅ 쿠키 처리
- MSW는 Set-Cookie 헤더를 정상적으로 처리
- httpOnly 쿠키도 브라우저에 저장됨

### ✅ 토큰 저장소 시뮬레이션
- Map을 사용하여 Refresh Token 저장소 시뮬레이션
- 실제 DB와 유사한 동작

## 주의사항

### ⚠️ 메모리 저장소
- MSW 핸들러의 Map은 메모리에만 존재
- 페이지 새로고침 시 초기화됨
- 실제 프로덕션에서는 DB에 저장해야 함

### ⚠️ 토큰 검증
- 현재 `simpleHash`는 보안에 취약
- 실제 프로덕션에서는 실제 HMAC-SHA256 사용

## 결론

**MSW 환경에서 리프레시 토큰 구현은 완전히 가능합니다.**

- ✅ Access Token과 Refresh Token 분리
- ✅ httpOnly 쿠키로 Refresh Token 저장
- ✅ 자동 토큰 갱신 로직
- ✅ 실제 서버와 동일한 동작 시뮬레이션

**개발 환경에서 실제 프로덕션과 동일한 인증 흐름을 테스트할 수 있습니다.**

