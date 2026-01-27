import type { ApiResponse } from './api'
import type { Pageable } from './article'

export interface Commentary {
  id: number
  summaryId: number
  type: string
  title: string
  text: string
  usedCrawledIds: string // JSON 배열 문자열
  createdAt: string
  updatedAt: string
}

export interface AISession {
  id: number
  commentaryId: number
  systemPromptKey: string
  status: string
  adoptedMessageId: number
  createdAt: string
  updatedAt: string
}

export interface Message {
  message: string
}

export interface PaginatedCommentaries {
  content: Commentary[]
  pageable: Pageable
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
  size: number
  number: number
  numberOfElements: number
  empty: boolean
}

/**
 * {
  "revision": {
    "id": 0,
    "commentaryId": 0,
    "revisionNo": 0,
    "chatSessionId": 0,
    "chatMessageId": 0,
    "title": "string",
    "text": "string",
    "isCurrent": true,
    "createdAt": "2026-01-27T11:12:24.381Z"
  },
  "message": "string"
}
 */

export interface AdoptCommentaryResponseData {
  revision: {
    id: number
    commentaryId: number
    revisionNo: number
    chatSessionId: number
    chatMessageId: number
    title: string
    text: string
    isCurrent: boolean
    createdAt: string
  },
  message: string
}
export type CommentariesResponse = ApiResponse<PaginatedCommentaries>
export type CommentaryResponse = ApiResponse<{ commentary: Commentary }>
export type AISessionResponse = ApiResponse<AISession>
export type MessageResponse = ApiResponse<Message>
export type AdoptCommentaryResponse = ApiResponse<AdoptCommentaryResponse>