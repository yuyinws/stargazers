import { create } from 'zustand'
import { Account, initDb, getAllAccount } from "@/lib/db";
import { persist } from 'zustand/middleware'

interface AccountStore {
  currentAccount: Account | null
  allAccount: Account[]
  setCurrentAccount: (account: Account) => void
  setAllAccount: (accounts: Account[]) => Promise<void>
  refreshAllAccount: () => Promise<void>
}

export const useAccountStore = create<AccountStore>()(
  persist(
    (set) => ({
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

        set(() => ({
          allAccount: accounts
        }))
      },

      setAllAccount: async (accounts: Account[]) => {
        set(() => ({
          allAccount: accounts
        }))
      }
    }),
    {
      name: "account",
    }
  )
)
