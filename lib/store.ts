import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Mode = 'work' | 'rest'
export type Status = 'idle' | 'working' | 'resting'

interface WorkTimerState {
  mode: Mode
  status: Status
  workTime: number // in seconds
  restTime: number // in seconds
  workDuration: number // in minutes
  restDuration: number // in minutes
  timerInterval: number // in minutes
  waterInterval: number // in minutes
  telegramToken: string
  telegramChatId: string
  useCameraDetection: boolean
  useBrowserNotifications: boolean
  useTelegramNotifications: boolean
  
  setMode: (mode: Mode) => void
  setStatus: (status: Status) => void
  incrementWorkTime: () => void
  incrementRestTime: () => void
  resetWorkTime: () => void
  resetRestTime: () => void
  resetTimers: () => void
  setWorkDuration: (duration: number) => void
  setRestDuration: (duration: number) => void
  setTimerInterval: (interval: number) => void
  setWaterInterval: (interval: number) => void
  setTelegramToken: (token: string) => void
  setTelegramChatId: (chatId: string) => void
  setUseCameraDetection: (use: boolean) => void
  setUseBrowserNotifications: (use: boolean) => void
  setUseTelegramNotifications: (use: boolean) => void
}

export const useWorkTimerStore = create<WorkTimerState>()(
  persist(
    (set) => ({
      mode: 'work',
      status: 'idle',
      workTime: 0,
      restTime: 0,
      workDuration: 50,
      restDuration: 10,
      timerInterval: 0,
      waterInterval: 0,
      telegramToken: '',
      telegramChatId: '',
      useCameraDetection: false,
      useBrowserNotifications: true,
      useTelegramNotifications: true,
      
      setMode: (mode) => set({ mode }),
      setStatus: (status) => set({ status }),
      incrementWorkTime: () => set((state) => ({ workTime: state.workTime + 1 })),
      incrementRestTime: () => set((state) => ({ restTime: state.restTime + 1 })),
      resetWorkTime: () => set({ workTime: 0 }),
      resetRestTime: () => set({ restTime: 0 }),
      resetTimers: () => set({ workTime: 0, restTime: 0 }),
      setWorkDuration: (duration) => set({ workDuration: duration }),
      setRestDuration: (duration) => set({ restDuration: duration }),
      setTimerInterval: (interval) => set({ timerInterval: interval }),
      setWaterInterval: (interval) => set({ waterInterval: interval }),
      setTelegramToken: (token) => set({ telegramToken: token }),
      setTelegramChatId: (chatId) => set({ telegramChatId: chatId }),
      setUseCameraDetection: (use) => set({ useCameraDetection: use }),
      setUseBrowserNotifications: (use) => set({ useBrowserNotifications: use }),
      setUseTelegramNotifications: (use) => set({ useTelegramNotifications: use }),
    }),
    {
      name: 'work-timer-storage',
    }
  )
)
