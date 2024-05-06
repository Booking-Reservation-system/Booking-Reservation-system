import {create} from "zustand";
import {persist, createJSONStorage} from 'zustand/middleware'

const useStoreGithubToken = create (persist(
    (set) => ({
        accessTokenGithub: null,
        setAccessTokenGithub: (newToken) => set({ accessTokenGithub: newToken }),
    }),
    {
        name: 'github-token-storage',
        storage: createJSONStorage(() => sessionStorage)
    }
))

export default useStoreGithubToken;