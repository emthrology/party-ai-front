import type { ApiResponse } from './api'

export interface Article {
  id: number
  contentType: string
  publisher: string
  originalLink: string
  originalWriteAt: string
  stance: string
  section: string
  title: string
  articleWriter: string
  articleTxt: string
  articleStructure: string // JSON 문자열
  articleTitleOrigin: string | null
  articleTxtOrigin: string | null
  youtubeStt: string | null
  youtubeSummary: string | null
  youtubeThumbnail: string | null
  createdAt: string
  updatedAt: string
}

export interface Pageable {
  pageNumber: number
  pageSize: number
  sort: {
    sorted: boolean
    empty: boolean
    unsorted: boolean
  }
  offset: number
  paged: boolean
  unpaged: boolean
}

export interface PaginatedArticles {
  content: Article[]
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

export type ArticlesResponse = ApiResponse<PaginatedArticles>
export type ArticleResponse = ApiResponse<{ article: Article }>