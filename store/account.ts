import { create } from 'zustand'
import { Account,initDb, getAllAccount } from "@/lib/db";

interface AccountStore {
  currentAccount: Account | null
  allAccount: Account[]
  setCurrentAccount: (account: Account) => void
  setAllAccount:  (accounts: Account[]) => Promise<void>
  refreshAllAccount: () => Promise<void>
}

export const useAccountStore = create<AccountStore>((set,get) => ({
  currentAccount: null,
  allAccount: [],

  setCurrentAccount: (account: Account) => {
    set(() => ({
      currentAccount: account
    }))
  },

  refreshCurrentAccount: () => {
    const currentLogin = get().currentAccount?.login
    const allAccount = get().allAccount

    set(() => ({
      currentAccount: allAccount.find((account) => account.login === currentLogin)
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
}))
