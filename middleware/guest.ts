export default defineNuxtRouteMiddleware(async (to) => {
  const { token, isAuthenticated, fetchUser } = useAuth()

  // 토큰이 있으면 사용자 정보 확인
  if (token.value) {
    // 사용자 정보가 없으면 가져오기 시도
    if (!isAuthenticated.value) {
      const user = await fetchUser()
      
      // 사용자 정보를 성공적으로 가져왔으면 (인증됨) 홈으로 리다이렉트
      if (user) {
        return navigateTo('/home')
      }
    } else {
      // 이미 인증된 상태면 홈으로 리다이렉트
      return navigateTo('/home')
    }
  }
})

