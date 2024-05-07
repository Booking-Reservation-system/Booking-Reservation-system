import {create} from "zustand";
import {persist, createJSONStorage} from 'zustand/middleware'

const useTokenStore = create(persist(
    (set) => ({
        accessToken: null,
        setAccess: (newToken) => set({accessToken: newToken}),

        expiresAt: null,
        setExpires: (newExpires) => set({expiresAt: newExpires}),

        refreshToken: null,
        setRefresh: (newToken) => set({refreshToken: newToken}),

        authName: null,
        setAuthName: (newName) => set({authName: newName}),

        isAuthenticated: false,
        setAuth: (newAuth) => set({isAuthenticated: newAuth}),
    }),
    {
        name: 'token-storage',
        storage: createJSONStorage(() => localStorage)
    }
))

export default useTokenStore;

