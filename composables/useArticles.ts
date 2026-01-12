import type { ArticlesResponse, ArticleResponse } from '~/types'

export const useArticles = () => {
  //handlers.ts 상의 

  const fetchArticles = async (): Promise<ArticlesResponse> => {
    const response = await $fetch<ArticlesResponse>('/api/articles')
    return response
  }

  const fetchArticle = async (id: number): Promise<ArticleResponse> => {
    const response = await $fetch<ArticleResponse>(`/api/article/${id}`)
    return response
  }

  return {
    fetchArticles,
    fetchArticle
  }
}