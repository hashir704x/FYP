import { getChatsForUser } from "@/api-functions/chat-functions";
import { chatsStore } from "@/store/chats-store";
import { userAuthStore } from "@/store/user-auth-store";
import { supabaseClient } from "@/Supabase-client";
import type { UserType } from "@/Types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const ChatsHandlerComponent = () => {
    const queryClient = useQueryClient();
    const user = userAuthStore((state) => state.user) as UserType;
    const setChatsDataArray = chatsStore((state) => state.setChatsDataArray);
    const { data, isSuccess } = useQuery({
        queryFn: () =>
            getChatsForUser({
                userId: user.userId,
                userRole: user.role,
                getDetails: true,
            }),

        queryKey: ["get-chats-data", user.userId],
    });

    useEffect(() => {
        if (data && isSuccess) {
            setChatsDataArray([...data]);

            const unreadChatsIds = chatsStore.getState().unreadChatsIds;
            const addChatIdToUnreadChatsIds =
                chatsStore.getState().addChatIdToUnreadChatsIds;

            data.forEach((chat) => {
                const lastReadMessageId =
                    user.role === "client"
                        ? chat.last_read_message_id_client
                        : chat.last_read_message_id_freelancer;

                if (
                    !lastReadMessageId ||
                    (chat.latest_message_id &&
                        !unreadChatsIds.includes(chat.id) &&
                        chat.latest_message_id > lastReadMessageId)
                ) {
                    addChatIdToUnreadChatsIds(chat.id);
                }
            });
        }
    }, [data]);

    useEffect(() => {
        const column = user.role === "client" ? "client_id" : "freelancer_id";
        const insertChannel = supabaseClient
            .channel("chats_insert")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chats",
                    filter: `${column}=eq.${user.userId}`,
                },
                () => {
                    console.log("New chat inserted, invalidating query...");
                    queryClient.invalidateQueries({
                        queryKey: ["get-chats-data", user.userId],
                    });
                }
            )
            .subscribe();

        const updateChannel = supabaseClient
            .channel("chats_update")
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "chats",
                    filter: `${column}=eq.${user.userId}`,
                },
                (payload) => {
                    const newChat = payload.new;
                    const oldChat = payload.old;

                    const updatedChatId = newChat.id;

                    if (oldChat.latest_message_id === newChat.latest_message_id) return;

                    if (newChat.last_updated_by === user.userId) return;

                    const activeChat = chatsStore.getState().activeChat;
                    const unreadChatsIds = chatsStore.getState().unreadChatsIds;

                    if (
                        !unreadChatsIds.includes(updatedChatId) &&
                        (!activeChat || activeChat.id !== updatedChatId)
                    ) {
                        chatsStore.getState().addChatIdToUnreadChatsIds(updatedChatId);
                        queryClient.invalidateQueries({
                            queryKey: ["get-chats-data", user.userId],
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabaseClient.removeChannel(insertChannel);
            supabaseClient.removeChannel(updateChannel);
        };
    }, []);
    return null;
};

export default ChatsHandlerComponent;
