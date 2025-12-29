import { http, HttpResponse } from 'msw'
import { generateToken, verifyToken } from '~/utils/jwt'

// 모의 사용자 데이터
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123', // 실제로는 해시된 비밀번호여야 함
    name: '테스트 사용자'
  },
  {
    id: '2',
    email: 'admin@example.com',
    password: 'admin123',
    name: '관리자'
  }
]

export const handlers = [
  // 로그인 API
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string }

    // 사용자 찾기
    const user = mockUsers.find(
      u => u.email === body.email && u.password === body.password
    )

    if (!user) {
      return HttpResponse.json(
        { error: '이메일 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    // JWT 토큰 생성
    const token = generateToken({
      userId: user.id,
      email: user.email
    })

    return HttpResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    })
  }),

  // 현재 사용자 정보 조회 (JWT 검증)
  http.get('/api/auth/me', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: '인증 토큰이 필요합니다.' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const payload = verifyToken(token)

    if (!payload) {
      return HttpResponse.json(
        { error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      )
    }

    const user = mockUsers.find(u => u.id === payload.userId)

    if (!user) {
      return HttpResponse.json(
        { error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return HttpResponse.json({
      id: user.id,
      email: user.email,
      name: user.name
    })
  }),

  // 로그아웃 API (클라이언트에서 토큰 삭제)
  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  })
]

