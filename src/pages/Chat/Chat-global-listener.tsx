import { useEffect } from "react";
import { supabaseClient } from "@/Supabase-client";
import { userAuthStore } from "@/store/user-auth-store";
import type { UserType } from "@/Types";
import { chatsStore } from "@/store/chats-store";

const ChatGlobalListener = () => {
    const user = userAuthStore((state) => state.user) as UserType;
    const addUnreadChatId = chatsStore((state) => state.addUnreadChatId);
    const activeChatId = chatsStore((state) => state.activeChatId);

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
                    console.log("message came, lets check");

                    if (
                        payload.new.client_id === user.userId ||
                        payload.new.freelancer_id === user.userId
                    ) {
                        const chatId = payload.new.chat_id;
                        if (chatId !== activeChatId) {
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
