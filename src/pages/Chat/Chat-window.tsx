import { supabaseClient } from "@/Supabase-client";
import type { ChatFromBackendType, MessageFromBackendType } from "@/Types";
import {
    getMessagesForChat,
    sendMessage,
} from "@/api-functions/chat-functions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState, useRef } from "react";
import { Send } from "lucide-react"; // nice minimal icon

type PropsType = {
    selectedChat: ChatFromBackendType;
    userId: string;
    userRole: "client" | "freelancer";
};

const ChatWindow = (props: PropsType) => {
    const { userDetails } = props.selectedChat;
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<MessageFromBackendType[]>([]);
    const [isError, setIsError] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const [sendingMessageLoading, setSendingMessageLoading] = useState(false);

    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let channel: RealtimeChannel;
        (async function () {
            try {
                setIsLoading(true);
                const messagesData = await getMessagesForChat(
                    props.selectedChat.id,
                );
                setMessages(messagesData);

                channel = supabaseClient
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
                            const newMessage =
                                payload.new as MessageFromBackendType;
                            setMessages((prev) => [...prev, newMessage]);
                        },
                    )
                    .subscribe();
            } catch (error) {
                console.error(error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        })();

        return function () {
            console.log("Unsubscribing chat window channel");
            if (channel) supabaseClient.removeChannel(channel);
        };
    }, []);

    // auto scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (isError)
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                Failed to load messages.
            </div>
        );

    const handleSend = async () => {
        if (!inputValue.trim()) return;
        console.log("send:", inputValue);

        try {
            setSendingMessageLoading(true);
            await sendMessage(
                props.selectedChat.id,
                props.selectedChat.freelancer_id,
                props.selectedChat.client_id,
                props.userRole,
                inputValue.trim(),
            );
            setInputValue("");
        } catch (error) {
            console.error(error);
        } finally {
            setSendingMessageLoading(false);
        }
    };

    return (
        <div className="flex flex-col w-full h-full bg-white shadow-sm overflow-hidden">
            {/* --- Chat Header --- */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                <Avatar className="h-11 w-11 border">
                    <AvatarImage
                        src={userDetails?.profile_pic}
                        alt={userDetails?.username}
                        className="object-cover"
                    />
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                        {userDetails?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <span className="font-semibold text-gray-900 text-lg">
                    {userDetails?.username}
                </span>
            </div>

            {/* --- Chat Messages --- */}
            <div className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-b from-gray-50 to-white space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Spinner className="text-[var(--my-blue)] w-8 h-8" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-gray-400 text-center py-10">
                        No messages yet
                    </div>
                ) : (
                    messages.map((item) => {
                        const isSentByCurrentUser =
                            props.userRole === item.sender_role;

                        return (
                            <div
                                key={item.id}
                                className={`flex ${
                                    isSentByCurrentUser
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[75%] sm:max-w-[70%] md:max-w-[60%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                        isSentByCurrentUser
                                            ? "bg-[var(--my-blue)] text-white rounded-tr-none"
                                            : "bg-gray-200 text-gray-800 rounded-tl-none"
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap break-words">
                                        {item.message_text}
                                    </p>
                                    {/*<span className="text-[10px] opacity-70 block mt-1 text-right">
                                        {new Date(
                                            item.created_at,
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>*/}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            {/* --- Input Area --- */}
            <div className="border-t border-gray-200 p-3 bg-gray-50">
                <div className="flex items-center gap-2">
                    <input
                        disabled={sendingMessageLoading}
                        type="text"
                        placeholder="Type a message..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSend();
                        }}
                        className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-sm sm:text-base"
                    />
                    <button
                        disabled={sendingMessageLoading || !inputValue.trim()}
                        onClick={handleSend}
                        className="disabled:bg-[var(--my-blue)]/50 p-2 rounded-xl bg-[var(--my-blue)]  hover:bg-[var(--my-blue-light)] transition text-white"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
