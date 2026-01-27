/**
 * 서버 시간과의 9시간 차이를 보정하여 "몇 시간 전" 또는 "며칠 전" 형식으로 반환
 * 
 * 서버가 UTC 시간을 보내고, 클라이언트가 한국 시간(KST = UTC+9)을 사용하는 경우
 * 서버 시간에 9시간을 더하여 한국 시간으로 보정합니다.
 * 
 * @param dateString 서버에서 받은 날짜 문자열 (ISO 8601 형식, 예: "2025-01-01T10:00:00" 또는 "2025-01-01T10:00:00Z")
 * @returns "N시간 전" 또는 "N일 전" 형식의 문자열
 */
export function timeAgo(dateString: string | null | undefined): string {
  if (!dateString) return ''

  try {
    // 서버 시간을 Date 객체로 변환
    // ISO 8601 문자열이 'Z'로 끝나지 않으면 로컬 시간으로 해석됨
    const serverDate = new Date(dateString)
    
    // 서버가 UTC 시간을 보내는 경우, 한국 시간(KST = UTC+9)으로 보정
    // 서버 시간에 9시간(9 * 60 * 60 * 1000 밀리초)을 더함
    const koreaDate = new Date(serverDate.getTime() + 9 * 60 * 60 * 1000)
    
    // 현재 시간 (브라우저의 로컬 시간, 한국 시간대 사용 시 자동으로 한국 시간)
    const now = new Date()
    
    // 시간 차이 계산 (밀리초)
    const diffTime = Math.abs(now.getTime() - koreaDate.getTime())
    
    // 시간 차이를 시간 단위로 변환
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60))
    
    if (diffHours < 24) {
      return `${diffHours}시간 전`
    } else {
      return `${Math.ceil(diffHours / 24)}일 전`
    }
  } catch (error) {
    console.error('timeAgo error:', error, 'dateString:', dateString)
    return ''
  }
}
