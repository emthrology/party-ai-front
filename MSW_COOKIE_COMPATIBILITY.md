# MSW와 쿠키 보안 설정 호환성 분석

## 현재 구현 방식

### 현재 코드
```typescript
// composables/useAuth.ts
const token = useCookie<string | null>('auth_token', {
  default: () => null,
  maxAge: 60 * 60 * 24 * 7
})

// 토큰 저장
setToken(newToken) {
  token.value = newToken  // ← JavaScript로 직접 쿠키에 쓰기
}

// 토큰 읽기
token.value  // ← JavaScript로 직접 쿠키 읽기
```

## 문제점 분석

### 1. `httpOnly: true` 설정 시 문제

**현재 방식과의 충돌:**
- `httpOnly: true`를 설정하면 **JavaScript에서 쿠키에 접근할 수 없음**
- 현재 코드는 `token.value`로 직접 쿠키를 읽고 쓰고 있음
- `httpOnly` 쿠키는 **서버에서만** Set-Cookie 헤더로 설정 가능

**영향:**
```typescript
// ❌ 작동하지 않음
const token = useCookie('auth_token', {
  httpOnly: true,  // 이렇게 설정하면
  ...
})

token.value = 'new-token'  // ← 에러: 접근 불가
const value = token.value  // ← 에러: 접근 불가
```

### 2. MSW와의 관계

**MSW는 쿠키와 잘 작동함:**
- MSW는 Service Worker를 통해 네트워크 요청을 가로챔
- 쿠키는 브라우저가 자동으로 요청에 포함시킴
- `httpOnly` 쿠키도 자동으로 포함되므로 MSW와 문제없음

**하지만 현재 구현 방식의 문제:**
- 클라이언트에서 쿠키를 직접 읽고 쓰는 방식
- `httpOnly`를 사용하면 이 방식이 작동하지 않음

## 해결 방안

### 방안 1: 서버에서 쿠키 설정 (권장)

**MSW 핸들러에서 Set-Cookie 헤더 설정:**

```typescript
// mocks/handlers.ts
http.post('/api/auth/login', async ({ request }) => {
  // ... 로그인 로직 ...
  
  const token = generateToken({ userId: user.id, email: user.email })
  
  // Set-Cookie 헤더로 쿠키 설정
  return HttpResponse.json(
    { success: true, user: { ... } },
    {
      headers: {
        'Set-Cookie': `auth_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24 * 7}; Path=/`
      }
    }
  )
})
```

**클라이언트 코드 변경:**

```typescript
// composables/useAuth.ts
export const useAuth = () => {
  // httpOnly 쿠키는 JavaScript로 접근 불가
  // 대신 서버 응답에서 토큰을 받지 않고, 쿠키가 자동으로 설정됨
  
  const login = async (email: string, password: string) => {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
      credentials: 'include' // 쿠키 포함
    })
    
    // 토큰은 쿠키에 자동으로 저장됨 (서버에서 Set-Cookie로 설정)
    // JavaScript로는 접근 불가하므로, 서버 API로 사용자 정보 가져오기
    await fetchUser()
    
    return { success: true, user: response.user }
  }
  
  const fetchUser = async () => {
    // 쿠키는 자동으로 요청에 포함됨
    const userData = await $fetch('/api/auth/me', {
      credentials: 'include'
    })
    user.value = userData
    return userData
  }
  
  const logout = async () => {
    await $fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    // 서버에서 쿠키 삭제 (Set-Cookie: auth_token=; Max-Age=0)
    user.value = null
  }
}
```

**장점:**
- ✅ `httpOnly` 쿠키 사용 가능 (XSS 공격 방지)
- ✅ MSW와 완벽 호환
- ✅ 실제 프로덕션 환경과 동일한 방식

**단점:**
- ⚠️ 클라이언트에서 토큰 직접 접근 불가
- ⚠️ 토큰 만료 시간 확인을 서버 API로 해야 함

---

### 방안 2: 개발 환경에서는 httpOnly 비활성화

**조건부 설정:**

```typescript
// composables/useAuth.ts
const token = useCookie<string | null>('auth_token', {
  default: () => null,
  maxAge: 60 * 60 * 24 * 7,
  httpOnly: process.env.NODE_ENV === 'production', // 프로덕션에서만
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
})
```

**문제점:**
- ⚠️ 개발과 프로덕션 환경이 다름
- ⚠️ 개발 환경에서 보안 테스트 불가
- ⚠️ 프로덕션 배포 시 예상치 못한 문제 발생 가능

---

### 방안 3: MSW에서 쿠키 시뮬레이션 (현재 방식 유지)

**MSW는 쿠키를 자동으로 처리하지만, httpOnly는 제한적:**

```typescript
// mocks/handlers.ts
http.post('/api/auth/login', async ({ request, cookies }) => {
  // MSW의 cookies API 사용 (제한적)
  // 하지만 httpOnly 쿠키는 Service Worker에서도 접근 제한적
  
  const token = generateToken({ ... })
  
  // MSW에서 쿠키 설정 (httpOnly는 제한적)
  cookies.set('auth_token', token, {
    httpOnly: true,  // MSW에서도 제한적
    secure: false,   // 개발 환경
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7
  })
  
  return HttpResponse.json({ success: true, user: { ... } })
})
```

**문제점:**
- ⚠️ MSW의 쿠키 API는 실제 브라우저 쿠키와 완전히 동일하지 않음
- ⚠️ `httpOnly` 쿠키는 Service Worker에서도 접근 제한적

---

## 권장 해결책

### 개발 환경 (MSW 사용)
1. **MSW 핸들러에서 Set-Cookie 헤더 설정**
2. **클라이언트는 쿠키를 직접 읽지 않고 서버 API 사용**
3. **`credentials: 'include'`로 쿠키 자동 포함**

### 프로덕션 환경
1. **서버에서 Set-Cookie 헤더로 쿠키 설정**
2. **동일한 클라이언트 코드 사용**

## 결론

### ✅ MSW와 쿠키 보안 설정은 양립 가능

**하지만 현재 구현 방식은 수정 필요:**

1. **현재 방식 (JavaScript로 쿠키 직접 접근):**
   - ❌ `httpOnly: true`와 충돌
   - ❌ XSS 공격에 취약

2. **권장 방식 (서버에서 쿠키 설정):**
   - ✅ `httpOnly: true` 사용 가능
   - ✅ MSW와 완벽 호환
   - ✅ 프로덕션과 동일한 방식

**MSW 핸들러에서 Set-Cookie 헤더를 설정하면:**
- 브라우저가 자동으로 쿠키 저장
- `httpOnly` 쿠키도 정상 작동
- MSW가 요청을 가로채도 쿠키는 자동으로 포함됨

**따라서 MSW 설정과 쿠키 보안 설정은 양립 가능하지만, 구현 방식을 변경해야 함.**

