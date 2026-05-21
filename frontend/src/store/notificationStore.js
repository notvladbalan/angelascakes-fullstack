import { create } from 'zustand';

const useNotificationStore = create((set) => ({
  unseenCount: 0,
  setUnseenCount: (count) => set({ unseenCount: count }),
  decrement: () => set((s) => ({ unseenCount: Math.max(0, s.unseenCount - 1) })),
}));

export default useNotificationStore;
