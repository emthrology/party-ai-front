export default defineNuxtRouteMiddleware(async (to) => {
  const { token, isAuthenticated, fetchUser } = useAuth()

  // 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!token.value) {
    return navigateTo({
      path: '/',
      query: {
        redirect: to.fullPath // 로그인 후 원래 페이지로 돌아가기 위한 쿼리 파라미터
      }
    })
  }

  // 토큰이 있지만 사용자 정보가 없으면 가져오기 시도
  if (!isAuthenticated.value) {
    const user = await fetchUser()
    
    // 사용자 정보를 가져오지 못하면 (토큰이 유효하지 않음) 로그인 페이지로 리다이렉트
    if (!user) {
      return navigateTo({
        path: '/',
        query: {
          redirect: to.fullPath
        }
      })
    }
  }
})

