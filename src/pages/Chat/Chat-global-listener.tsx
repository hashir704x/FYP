import { useEffect } from "react";
import { supabaseClient } from "@/Supabase-client";
import { userAuthStore } from "@/store/user-auth-store";
import type { UserType } from "@/Types";
import { chatsStore } from "@/store/chats-store";

const ChatGlobalListener = () => {
    const user = userAuthStore((state) => state.user) as UserType;
    const addUnreadChatId = chatsStore((state) => state.addUnreadChatId);

    useEffect(() => {
        console.log("Subscribing to global chats channel");
        const channel = supabaseClient
            .channel("global-messages")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                },
                (payload) => {
                    const activeChat = chatsStore.getState().activeChat;

                    if (
                        payload.new.client_id === user.userId ||
                        payload.new.freelancer_id === user.userId
                    ) {
                        const chatId = payload.new.chat_id;
                        if (chatId !== activeChat?.id) {
                            addUnreadChatId(chatId);
                        }
                    }
                },
            )
            .subscribe();

        return function () {
            console.log("Unsubscribing to global chats channel");
            supabaseClient.removeChannel(channel);
        };
    }, []);
    return null;
};

export default ChatGlobalListener;
