import { Account } from '@/lib/db';
import { create } from 'zustand'
import { Star, initDb, searchStar, addStar } from '@/lib/db'

interface StarStore {
  stars: Star[]
  loading: boolean
  queryForm: QueryForm,

  fetchStars: (username: string) => Promise<void>
  getStarFromIndexDB: (username: string) => Promise<void>
  setQueryForm: (queryForm: Partial<QueryForm>) => void
}

export interface QueryForm {
  page: number
  size: number
  startTime: number
  endTime: number
  repo: string
  keyword: string
  language: string
}

export const useStarStore = create<StarStore>((set, get) => {
  return {
    stars: [],
    loading: false,
    queryForm: {
      page: 1,
      size: 12,
      startTime: -Infinity,
      endTime: Infinity,
      repo: '',
      keyword: '',
      language: '',
    },

    getStarFromIndexDB: async (username: string) => {
      try {
        set(() => ({
          loading: true
        }))
        const db = await initDb()
        const results = await searchStar(db, username, get().queryForm)
        console.log({
          results
        })
        set(() => ({
          stars: results.stars,
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

        const addTransactions: any[] = []

        const fetchByCursor = async (cursor: string) => {
          const response = await fetch(`/api/gh/stars?username=${username}&cursor=${cursor}`);
          const data = await response.json();

          if (data.errors) {
            throw new Error(data.errors);
          }

          const stars = data.data.stars
          const pageInfo = data.data.pageInfo
  
          const transactions: any[] = stars.map((star: Star) => {
            return star
          })

          addTransactions.push(...transactions)

          if (pageInfo.hasNextPage) {
            await fetchByCursor(pageInfo.endCursor)
          }
        }

        await fetchByCursor('')

        addTransactions.reduce((prev, cur) => {
          return prev.then(() => {
            return addStar(db, cur)
          })
        }, Promise.resolve())

        const transaction = db.transaction('accounts', 'readwrite')
        const store = transaction.objectStore('accounts')
        const account = (await store.get(username))!
        const updateData: Account = {
          ...account,
          lastSyncAt: Date.now().toString(),
        }

        await store.put(updateData)

        const results = await searchStar(db, username, get().queryForm)

        set(() => ({
          stars: results.stars
        }))
      } catch (error) {
        console.log(error)
      } finally {
        set(() => ({
          loading: false
        }))
      }
    },

    setQueryForm: (form: Partial<QueryForm>) => {
      set(() => ({
        queryForm: {
          ...get().queryForm,
          ...form
        }
      }))
    }
  }
})
