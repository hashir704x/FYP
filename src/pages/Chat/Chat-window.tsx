import { supabaseClient } from "@/Supabase-client";
import type { ChatFromBackendType, MessageFromBackendType } from "@/Types";
import { getMessagesForChat } from "@/api-functions/chat-functions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

type PropsType = {
    selectedChat: ChatFromBackendType;
};

const ChatWindow = (props: PropsType) => {
    const { userDetails } = props.selectedChat;
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<MessageFromBackendType[]>([]);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        (async function () {
            try {
                setIsLoading(true);
                const messagesData = await getMessagesForChat(props.selectedChat.id);
                setMessages(messagesData);
                console.log("messages:", messagesData);

                // channel subscription part
                const channel = supabaseClient
                    .channel(`chat_${props.selectedChat.id}`)
                    .on(
                        "postgres_changes",
                        {
                            event: "INSERT",
                            schema: "public",
                            table: "messages",
                            filter: `chat_id=eq.${props.selectedChat.id}`,
                        },
                        (payload) => {
                            const newMessage = payload.new as MessageFromBackendType;
                            console.log("new message:", newMessage);
                            setMessages((prev) => [...prev, newMessage]);
                        }
                    )
                    .subscribe();
            } catch (error) {
                setIsError(true);
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <div className="flex flex-col w-full h-full bg-white shadow-sm overflow-hidden">
            {/* --- Chat Header --- */}
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border">
                        <AvatarImage
                            src={userDetails?.profile_pic}
                            alt={userDetails?.username}
                        />
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                            {userDetails?.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <span className="font-semibold text-gray-900 text-lg">
                        {userDetails?.username}
                    </span>
                </div>
            </div>

            {/* Chat main section */}
            <div></div>
        </div>
    );
};

export default ChatWindow;
