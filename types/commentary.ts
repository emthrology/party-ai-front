import type { ApiResponse } from './api'

export interface Commentary {
  id: number
  original_link: string
  original_write_at: string
  section: string
  title: string
  content: string
  source_count: number
}

export type CommentariesResponse = ApiResponse<Commentary[]>
export type CommentaryResponse = ApiResponse<{ commentary: Commentary }>
