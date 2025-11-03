import { getChatsForUser } from "@/api-functions/chat-functions";
import { Spinner } from "@/components/ui/spinner";
import { userAuthStore } from "@/store/user-auth-store";
import { type ChatFromBackendType, type UserType } from "@/Types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ChatListDesktop from "./Chat-list-desktop";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/Supabase-client";
import ChatWindow from "./Chat-window";
import { MessageSquare } from "lucide-react";
// import { chatsStore } from "@/store/chats-store";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSearchParams } from "react-router-dom";

const ChatPage = () => {
    const [searchParams] = useSearchParams();
    const [activeChat, setActiveChat] = useState<null | ChatFromBackendType>(null);
    const user = userAuthStore((state) => state.user) as UserType;
    const isMobile = useIsMobile();

    const queryClient = useQueryClient();
    const {
        data: chats,
        isLoading,
        isError,
    } = useQuery({
        queryFn: () =>
            getChatsForUser({
                userId: user.userId,
                userRole: user.role,
                getDetails: true,
            }),
        queryKey: ["get-chats-data", user.userId],
    });

    useEffect(() => {
        console.log("search use Effect")
        const chatId = searchParams.get("chatId");
        if (chatId) {
            const targetChat = chats?.find((item) => item.id === chatId);
            if (targetChat) setActiveChat(targetChat);
        }
    }, [chats]);

    useEffect(() => {
        console.log("Subscribing chats channel");
        const column = user.role === "client" ? "client_id" : "freelancer_id";

        const chatsChannel = supabaseClient
            .channel("chats")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "chats",
                    filter: `${column}=eq.${user.userId}`,
                },
                (payload) => {
                    console.log("chats payload", payload);
                    queryClient.invalidateQueries({
                        queryKey: ["get-chats-data", user.userId],
                    });
                }
            )
            .subscribe();

        return function () {
            console.log("Unsubscribing chats channel");
            supabaseClient.removeChannel(chatsChannel);
            queryClient.invalidateQueries({
                queryKey: ["get-chats-data", user.userId],
            });

            setActiveChat(null);
        };
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-semibold h-[70px] px-4 justify-center md:justify-start border-b flex items-center">
                Chats
            </h1>

            {isLoading && (
                <div className="h-[calc(100vh-100px)] flex justify-center items-center w-full">
                    <Spinner className="w-12 h-12 text-[var(--my-blue)]" />
                </div>
            )}

            {isError && (
                <div className="h-[calc(100vh-70px)] flex justify-center items-center w-full">
                    <p>Error in getting Chats data</p>
                </div>
            )}

            {chats && chats.length === 0 && <div>You have no chats right now</div>}

            {chats && chats.length >= 1 && (
                <div>
                    {isMobile ? (
                        <div className="h-[calc(100vh-70px)]">
                            {!activeChat ? (
                                <div className="h-full ">
                                    <ChatListDesktop
                                        chats={chats}
                                        activeChat={activeChat}
                                        setActiveChat={setActiveChat}
                                    />
                                </div>
                            ) : (
                                <div className="h-full">
                                    <ChatWindow
                                        key={activeChat.id}
                                        userId={user.userId}
                                        userRole={user.role}
                                        activeChat={activeChat}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-[calc(100vh-70px)] flex">
                            <div className="w-72 h-full">
                                <ChatListDesktop
                                    chats={chats}
                                    activeChat={activeChat}
                                    setActiveChat={setActiveChat}
                                />
                            </div>
                            {activeChat ? (
                                <ChatWindow
                                    key={activeChat.id}
                                    userId={user.userId}
                                    userRole={user.role}
                                    activeChat={activeChat}
                                />
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center bg-gray-50">
                                    <div className="flex flex-col items-center space-y-4 max-w-sm px-6">
                                        <div className="p-6 bg-blue-100 rounded-full">
                                            <MessageSquare className="w-10 h-10 text-blue-600" />
                                        </div>

                                        <h2 className="text-2xl font-semibold text-gray-700">
                                            No chat selected
                                        </h2>

                                        <p className="text-gray-500 text-sm leading-relaxed">
                                            Select a chat from the list to start
                                            messaging.
                                            <br />
                                            Your conversations will appear here.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatPage;
