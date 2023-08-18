import { Account } from '@/lib/db';
import { create } from 'zustand'
import { Star, initDb, searchStarByLogin, addStar } from '@/lib/db'

interface StarStore {
  stars: Star[]
  loading: boolean

  fetchStars: (username: string) => Promise<void>
  getStarFromIndexDB: (username: string) => Promise<void>
}

export const useStarStore = create<StarStore>((set, get) => {
  return {
    stars: [],
    loading: false,

    getStarFromIndexDB: async (username: string) => {
      try {
        set(() => ({
          loading: true
        }))
        const db = await initDb()
        const stars = await searchStarByLogin(db, username)

        set(() => ({
          stars: stars,
        }))
      } catch (error) {
        console.log(error)
      } finally {
        set(() => ({
          loading: false
        }))
      }
    },

    fetchStars: async (username: string) => {
      try {
        set(() => ({
          loading: true
        }))

        const db = await initDb()

        const response = await fetch(`/api/gh/stars?username=${username}`);
        const data = await response.json();

        const addTransactions = data.data.map((star: Star) => {
          return addStar(db, star)
        })

        await Promise.allSettled(addTransactions)

        const transaction = db.transaction('accounts', 'readwrite')
        const store = transaction.objectStore('accounts')
        const account = (await store.get(username))!
        const updateData: Account = {
          ...account,
          lastSyncAt: Date.now().toString(),
        }

        await store.put(updateData)


        set(() => ({
          stars: data.data as Star[],
        }))
      } catch (error) {
        console.log(error)
      } finally {
        set(() => ({
          loading: false
        }))
      }
    }
  }
})
