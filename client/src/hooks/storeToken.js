import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

const useTokenStore = create (persist(
    (set) => ({
        token: null,
        setToken: (newToken) => set({ token: newToken }),
    }),
    {
        name: 'token-storage',
        storage: createJSONStorage(() => localStorage)
    }
))

export default useTokenStore;

