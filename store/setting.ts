import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useStarStore } from '@/store'

interface Setting {
  autoSwitch: boolean
  dateRange: string
}

interface SettingStore {
  settings: Setting
  setSettings(settings: Partial<Setting>): void
}

export const useSettingStore = create<SettingStore>()(
  persist(
    (set, get) => ({
      settings: {
        autoSwitch: true,
        dateRange: '2'
      },
      setSettings(settings: Partial<Setting>) {
        set(() => ({
          settings: {
            ...get().settings,
            ...settings
          }
        }))
      }
    }),
    {
      name: 'setting'
    }
  )
)
