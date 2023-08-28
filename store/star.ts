import { Account } from '@/lib/db';
import { create } from 'zustand'
import { Star, initDb, searchStar, addStar } from '@/lib/db'
import { subMonths, getUnixTime, subYears } from "date-fns";
import { cloneDeep } from 'lodash'
import { toast } from 'sonner'

export interface QueryForm {
  startTimeId?: string
  startTime?: Date | number
  endTime: Date | number
  keyword: string
  language: string
}

export interface Pagination {
  page: number
  size: number
  total: number
}

interface StarStore {
  stars: Star[]
  loading: boolean
  queryForm: QueryForm
  searchQueryForm: QueryForm
  pagination: Pagination

  fetchStars: (username: string) => Promise<void>
  getStarFromIndexDB: (username: string) => Promise<void>
  setQueryForm: (queryForm: Partial<QueryForm>) => void
  syncSearchQueryForm: () => void
  setPagintion: (pagination: Partial<Pagination>) => void
}

export const startTimeMap: Record<string, Date> = {
  0: subMonths(new Date(), 3),
  1: subMonths(new Date(), 6),
  2: subYears(new Date(), 1),
  3: subYears(new Date(), 2),
  4: subYears(new Date(), 5),
  5: subYears(new Date(), 10),
  6: subYears(new Date(), 20),
}

export const useStarStore = create<StarStore>((set, get) => {
  return {
    stars: [],
    loading: false,
    queryForm: {
      startTimeId: '2',
      startTime: startTimeMap[2],
      endTime: new Date(),
      keyword: '',
      language: '',
    },
    searchQueryForm: {
      startTimeId: '2',
      startTime: startTimeMap[2],
      endTime: new Date(),
      keyword: '',
      language: '',
    },
    pagination: {
      page: 1,
      size: 12,
      total: 0
    },

    getStarFromIndexDB: async (username: string) => {
      try {
        set(() => ({
          loading: true
        }))

        const db = await initDb()

        const searchQueryForm = cloneDeep(get().searchQueryForm)

        searchQueryForm.startTime = searchQueryForm.startTimeId ? getUnixTime(startTimeMap[searchQueryForm.startTimeId]) : -Infinity

        const results = await searchStar(db, username, {
          ...searchQueryForm,
          page: get().pagination.page,
          size: get().pagination.size
        })
        set(() => ({
          stars: results.stars,
          pagination: {
            ...get().pagination,
            total: results.total
          }
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

        toast('Start fetching...', {
          description: 'It may take a few minutes, depending on the number of stars for this account..',
          duration: 5000
        })

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

        const additionPromise = addTransactions.reduce((prev, cur) => {
          return prev.then(() => {
            return addStar(db, cur)
          })
        }, Promise.resolve())

        await additionPromise

        const transaction = db.transaction('accounts', 'readwrite')
        const store = transaction.objectStore('accounts')
        const account = (await store.get(username))!
        const updateData: Account = {
          ...account,
          lastSyncAt: Date.now().toString(),
        }

        await store.put(updateData)

        const results = await searchStar(db, username, {
          ...get().queryForm,
          page: get().pagination.page,
          size: get().pagination.size
        })

        set(() => ({
          stars: results.stars,
          pagination: {
            ...get().pagination,
            total: results.total
          }
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
    },

    syncSearchQueryForm: () => {
      set(() => ({
        searchQueryForm: {
          ...get().queryForm,
        }
      }))
    },

    setPagintion: (pagination: Partial<Pagination>) => {
      set(() => ({
        pagination: {
          ...get().pagination,
          ...pagination,
        }
      }))
    },
  }
})
