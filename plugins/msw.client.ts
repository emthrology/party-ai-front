export default defineNuxtPlugin(async () => {
  // 개발 환경에서만 MSW 활성화
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('~/mocks/browser')
    
    // MSW 워커 시작
    await worker.start({
      onUnhandledRequest: 'bypass', // MSW가 처리하지 않는 요청은 그대로 통과
      serviceWorker: {
        url: '/mockServiceWorker.js'
      }
    })

    console.log('✅ MSW (Mock Service Worker)가 활성화되었습니다.')
  }
})

