import type { Story } from '~/types'

export const useNews = () => {
  const apiBase = 'https://hacker-news.firebaseio.com/v0';


  const fetchStories = async (type: 'new' | 'top' | 'best' | 'ask' | 'show' | 'job') => {
    const response = await fetch(`${apiBase}/${type}stories.json`);
    const data = await response.json();
    const stories = await Promise.all(
      data.slice(0, 30).map(async (id: number) => {
        const story = await $fetch<Partial<Story>>(`${apiBase}/item/${id}.json`)
        return { id, ...story }
      })
    )
    return stories;
  }

  return {
    fetchStories
  }
}