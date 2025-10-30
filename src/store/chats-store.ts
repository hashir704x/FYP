import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type ChatsStoreType } from "@/Types";

const chatsStore = create(
    persist<ChatsStoreType>(
        (set) => ({
            activeChatId: null,
            unreadChatsIds: [],
            setActiveChatId: (chatId) => set({ activeChatId: chatId }),
            addUnreadChatId: (chatId) =>
                set((state) => {
                    if (state.unreadChatsIds.includes(chatId)) return state;
                    else
                        return {
                            unreadChatsIds: [...state.unreadChatsIds, chatId],
                        };
                }),
            removeUnreadChatId: (chatId) =>
                set((state) => ({
                    unreadChatsIds: state.unreadChatsIds.filter(
                        (item) => item !== chatId,
                    ),
                })),
        }),
        { name: "chats-store", storage: createJSONStorage(() => localStorage) },
    ),
);

export { chatsStore };
