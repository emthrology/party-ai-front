export interface Story {
  id: number
  title: string
  url: string
  time: number
  score: number
  by: string
  descendants: number
  kids: number[]
  type: string
}