import { create } from 'zustand'
import { Account, initDb, getAllAccount } from "@/lib/db";
import { persist } from 'zustand/middleware'

interface AccountStore {
  currentAccount: Account | null
  allAccount: Account[]
  setCurrentAccount: (account: Account) => void
  setAllAccount: (accounts: Account[]) => Promise<void>
  refreshAllAccount: () => Promise<void>
  deleteAccount: (account: Account) => Promise<void>
}

export const useAccountStore = create<AccountStore>()(
  persist(
    (set, get) => ({
      currentAccount: null,
      allAccount: [],

      setCurrentAccount: (account: Account) => {
        set(() => ({
          currentAccount: account
        }))
      },

      refreshAllAccount: async () => {
        const db = await initDb();
        const accounts = await getAllAccount(db);

        const currentAccount = accounts?.find((account) => account.login === get().currentAccount?.login)

        set(() => ({
          allAccount: accounts,
          currentAccount
        }))
      },

      setAllAccount: async (accounts: Account[]) => {
        set(() => ({
          allAccount: accounts
        }))
      },

      deleteAccount: async (account: Account) => {
        try {
          const db = await initDb();
          await db.delete('accounts', account.login)

          const stars = await db.getAllFromIndex('stars', 'by_login', account.login)

          for (const star of stars) {
            await db.delete('stars', star.id)
          }

          const accounts = await getAllAccount(db);

          set(() => ({
            allAccount: accounts || []
          }))

          if (get().currentAccount?.login === account.login && accounts?.length > 0) {
            set(() => ({
              currentAccount: accounts[0]
            }))
          } else if (accounts?.length === 0) {
            set(() => ({
              currentAccount: null
            }))
          } 
        } catch (error) {
          throw error
        }
      }
    }),
    {
      name: "account",
    }
  )
)
