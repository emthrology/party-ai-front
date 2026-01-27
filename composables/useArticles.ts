import type { ArticlesResponse, ArticleResponse } from '~/types'

export const useArticles = () => {
  //handlers.ts 상의 

  const fetchArticles = async (options?: {
    page?: number
    size?: number
    sort?: string
    publisher?: string
  }): Promise<ArticlesResponse> => {
    const queryParams = new URLSearchParams()
    if (options?.page) queryParams.append('page', String(options.page))
    if (options?.size) queryParams.append('size', String(options.size))
    if (options?.sort) queryParams.append('sort', options.sort)
    if (options?.publisher) queryParams.append('publisher', options.publisher)
    const url = `/api/v1/crawls${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    
    const response = await $fetch<ArticlesResponse>(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  }

  const fetchArticle = async (id: number): Promise<ArticleResponse> => {
    const response = await $fetch<ArticleResponse>(`/api/v1/crawls/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return response
  }

  return {
    fetchArticles,
    fetchArticle
  }
}