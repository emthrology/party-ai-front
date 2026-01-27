import type { CommentariesResponse, CommentaryResponse, AISessionResponse, AdoptCommentaryResponseData } from '~/types/commentary'

export const useCommentary = () => {
  const fetchCommentaries = async (options?: {
    page?: number
    size?: number
    sort?: string
  }): Promise<CommentariesResponse> => {
    const queryParams = new URLSearchParams()
    if (options?.page !== undefined) queryParams.append('page', String(options.page))
    if (options?.size) queryParams.append('size', String(options.size))
    if (options?.sort) queryParams.append('sort', options.sort)

    const url = `/api/v1/commentaries${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await $fetch<CommentariesResponse>(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  }

  const fetchCommentary = async (id: number): Promise<CommentaryResponse> => {
    const response = await $fetch<CommentaryResponse>(`/api/v1/commentaries/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  }
  //ai 세션 생성
  const createAISession = async (
    commentaryId: number,
    systemPromptKey?: string
  ): Promise<AISessionResponse> => {
    const response = await $fetch<AISessionResponse>(`/api/chat/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ commentaryId, systemPromptKey })
    });
    return response;
  }

  const streamMessage = async (
    sessionId: number,
    message: string,
    onChunk: (chunk: string) => void
  ): Promise<{ id: number; content: string }> => {
    const response = await fetch(`/api/chat/sessions/${sessionId}/messages/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message })
    })

    if (!response.ok) {
      throw new Error('Failed to stream message')
    }

    // SSE 스트림 읽기
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('No response body')
    }

    let messageId: number | null = null
    let fullContent = ''
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      buffer += chunk

      // 완료된 SSE 이벤트 처리 (\n\n으로 끝나는 것들)
      while (buffer.includes('\n\n')) {
        const eventEnd = buffer.indexOf('\n\n')
        const event = buffer.substring(0, eventEnd)
        buffer = buffer.substring(eventEnd + 2)

        // data: 접두사 제거
        if (event.startsWith('data:')) {
          const content = event.substring(5)

          // [DONE] 이벤트 처리
          if (content.startsWith('[DONE]')) {
            try {
              const metaJson = content.substring(6)
              if (metaJson) {
                const meta = JSON.parse(metaJson)
                if (meta.messageId) {
                  messageId = meta.messageId
                }
              }
            } catch (e) {
              console.error('메타데이터 파싱 실패:', e)
            }
            // [DONE] 후에도 계속 처리 (버퍼에 남은 데이터가 있을 수 있음)
            continue
          }

          // 빈 데이터는 무시
          if (!content) continue

          // 이스케이프된 개행 문자 복원
          const unescaped = content.replace(/\\n/g, '\n').replace(/\\r/g, '\r')
          fullContent += unescaped
          onChunk(unescaped)
        }
      }
    }

    // 버퍼에 남은 데이터 처리 (마지막 이벤트)
    if (buffer.startsWith('data:')) {
      const content = buffer.substring(5).replace(/\n+$/, '').trim()
      
      if (content.startsWith('[DONE]')) {
        try {
          const metaJson = content.substring(6).trim()
          if (metaJson) {
            const meta = JSON.parse(metaJson)
            if (meta.messageId) {
              messageId = meta.messageId
            }
          }
        } catch (e) {
          console.error('메타데이터 파싱 실패:', e)
        }
      } else if (content) {
        // 이스케이프된 개행 문자 복원
        const unescaped = content.replace(/\\n/g, '\n').replace(/\\r/g, '\r')
        fullContent += unescaped
        onChunk(unescaped)
      }
    }

    // 스트림이 정상적으로 완료되지 않은 경우 처리
    if (!messageId && fullContent.length > 0) {
      // 메시지 ID가 없지만 콘텐츠가 있으면 임시 ID 사용
      messageId = Date.now()
    }
    
    return { id: messageId || 0, content: fullContent }
  }

  //채택하기
  const adoptCommentary = async (sessionId: number, messageId: number): Promise<AdoptCommentaryResponseData> => {
    const response = await $fetch<AdoptCommentaryResponseData>(`/api/chat/sessions/${sessionId}/adopt/${messageId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  }

  return {
    fetchCommentaries,
    fetchCommentary,
    streamMessage,
    createAISession,
    adoptCommentary
  }
}