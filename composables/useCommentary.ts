import type { CommentariesResponse, CommentaryResponse } from '~/types'

export const useCommentary = () => {
  const fetchCommentaries = async (): Promise<CommentariesResponse> => {
    const response = await $fetch<CommentariesResponse>('/api/commentaries')
    return response
  }

  const fetchCommentary = async (id: number): Promise<CommentaryResponse> => {
    const response = await $fetch<CommentaryResponse>(`/api/commentary/${id}`)
    return response
  }

  return {
    fetchCommentaries,
    fetchCommentary
  }
}