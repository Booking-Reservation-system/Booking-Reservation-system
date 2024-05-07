import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

const useStoreGoogleToken = create (persist(
    (set) => ({
        accessTokenGoogle: null,
        setAccessTokenGoogle: (newToken) => set({ accessTokenGoogle: newToken }),
    }),
    {
        name: 'google-token-storage',
        storage: createJSONStorage(() => localStorage)
    }
))

export default useStoreGoogleToken;