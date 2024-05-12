import {create} from "zustand";
import {persist, createJSONStorage} from 'zustand/middleware'

const useTokenStore = create(persist(
    (set) => ({
        isAuthenticated: false,
        setAuth: (newAuth) => set({isAuthenticated: newAuth}),
    }),
    {
        name: 'isAuthenticated',
        storage: createJSONStorage(() => localStorage)
    }
))

export default useTokenStore;

