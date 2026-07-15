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

export interface Revision {
  id: number
  commentaryId: number
  revisionNo: number
  chatSessionId: number | null
  chatMessageId: number | null
  title: string
  text: string
  isCurrent: boolean
  createdAt: string
}

export interface AdoptCommentaryResponseData {
  revision: Revision
  message: string
}

// 논평/채팅 API(백엔드)는 ApiResponse 래핑 없이 DTO를 그대로 반환한다.
// ApiResponse 래핑은 MSW로 목킹한 인증 API에만 적용된다.
export type CommentariesResponse = PaginatedCommentaries
export type CommentaryResponse = Commentary
export type AISessionResponse = AISession
export type RevisionsResponse = Revision[]
export type AdoptCommentaryResponse = AdoptCommentaryResponseData
export type MessageResponse = Message