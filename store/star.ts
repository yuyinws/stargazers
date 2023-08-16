import { create } from 'zustand'
import { Star } from '@/lib/db'

interface StarStore {
  stars: Star[]
  loading: boolean

  fetchStars: () => void
}

export const useStarStore = create<StarStore>((set) => ({
  stars: [],
  loading: false,

  fetchStars: async () => {
    try {
      set(() => ({
        loading: true
      }))
      const response = await fetch("/api/gh/stars");
      const data = await response.json();

      set(() => ({
        stars: data.data as Star[],
      }))
    } catch (error) {

    } finally {
      set(() => ({
        loading: false
      }))
    }
  }
}))
