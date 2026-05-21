import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,

      setAuth: (token, user) => {
        localStorage.setItem('token', token);
        set({ token, user });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null });
      },
    }),
    {
      name: 'angelas-cakes-auth',
    }
  )
);

export default useAuthStore;
