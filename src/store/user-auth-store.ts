import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type UserAuthStoreType } from "@/Types";

const userAuthStore = create(
    persist<UserAuthStoreType>(
        (set) => ({
            user: null,
            userExists: false,
            setUser: (user) => set({ user: user, userExists: true }),
            reset: () => set({ user: null, userExists: false }),
        }),
        { name: "user-auth-store", storage: createJSONStorage(() => localStorage) }
    )
);

export { userAuthStore };
