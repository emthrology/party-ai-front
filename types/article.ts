import type { ApiResponse } from './api'

export interface Article {
  id: number
  platform: string
  original_link: string
  original_write_at: string
  section: string
  news_writer: string
  title: string
  content: string
  image: ArticleImage | null
}

export interface ArticleImage {
  thumbnail: string
  image: string
}

export type ArticlesResponse = ApiResponse<Article[]>
export type ArticleResponse = ApiResponse<{ article: Article }>