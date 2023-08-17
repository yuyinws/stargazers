import { create } from 'zustand'
import { Account,initDb, getAllAccount } from "@/lib/db";

interface AccountStore {
  currentAccount: Account | null
  allAccount: Account[]
  setCurrentAccount: (account: Account) => void
  setAllAccount:  (accounts: Account[]) => Promise<void>
}

export const useAccountStore = create<AccountStore>((set) => ({
  currentAccount: null,
  allAccount: [],

  setCurrentAccount: (account: Account) => {
    set(() => ({
      currentAccount: account
    }))
  },

  setAllAccount: async (accounts: Account[]) => {
    set(() => ({
      allAccount: accounts
    }))
  }
}))
