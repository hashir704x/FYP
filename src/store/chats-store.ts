import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type ChatsStoreType } from "@/Types";

const chatsStore = create(
    persist<ChatsStoreType>(
        (set) => ({
            chatsDataArray: [],
            setChatsDataArray: (chats) => set({ chatsDataArray: chats }),
            activeChat: null,
            setActiveChat: (chat) => set({ activeChat: chat }),
            unreadChatsIds: [],
            addChatIdToUnreadChatsIds: (chatId) =>
                set((state) =>
                    state.unreadChatsIds.includes(chatId)
                        ? state
                        : { unreadChatsIds: [...state.unreadChatsIds, chatId] }
                ),
            removeChatIdFromUnreadChatsIds: (chatId) =>
                set((state) => ({
                    unreadChatsIds: state.unreadChatsIds.filter(
                        (item) => item !== chatId
                    ),
                })),
            clearUnreadChatsIds: () => set({ unreadChatsIds: [] }),
        }),
        { name: "chats-store", storage: createJSONStorage(() => localStorage) }
    )
);

export { chatsStore };
