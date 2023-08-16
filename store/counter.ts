import { create } from 'zustand'

interface CouterStore {
  count: number
  increment: () => void
}

export const useCounterStore = create<CouterStore>((set) => ({
  count: 0,

  increment() {
    set((state) => ({ count: state.count + 1 }))
  }

}))
