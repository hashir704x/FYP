import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { type ChatsStoreType } from "@/Types";

const chatsStore = create(
    persist<ChatsStoreType>(
        (set) => ({
            activeChat: null,
            unreadChatsIds: [],
            setActiveChat: (chat) =>
                set((state) => ({
                    activeChat: chat,
                    unreadChatsIds: chat
                        ? state.unreadChatsIds.filter(
                              (item) => item !== chat.id,
                          )
                        : state.unreadChatsIds,
                })),
            addUnreadChatId: (chatId) =>
                set((state) => {
                    if (state.unreadChatsIds.includes(chatId)) return state;
                    else
                        return {
                            unreadChatsIds: [...state.unreadChatsIds, chatId],
                        };
                }),

            clearChatsData: () => set({ activeChat: null, unreadChatsIds: [] }),
        }),
        { name: "chats-store", storage: createJSONStorage(() => localStorage) },
    ),
);

export { chatsStore };
