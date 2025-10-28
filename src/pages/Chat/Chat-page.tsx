import { getChatsForUser } from "@/api-functions/chat-functions";
import { Spinner } from "@/components/ui/spinner";
import { userAuthStore } from "@/store/user-auth-store";
import { type ChatFromBackendType, type UserType } from "@/Types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ChatListDesktop from "./Chat-list-desktop";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/Supabase-client";
import ChatWindow from "./Chat-window";

const ChatPage = () => {
    const user = userAuthStore((state) => state.user) as UserType;
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

    const [selectedChat, setSelectedChat] = useState<ChatFromBackendType | null>(null);

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
        };
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-semibold h-[70px] px-4 border-b flex items-center">
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
                    <div className="hidden lg:block">
                        <ChatListDesktop
                            chats={chats}
                            selectedChatId={selectedChat ? selectedChat.id : null}
                            setSelectedChat={setSelectedChat}
                        />
                    </div>

                    {selectedChat && <ChatWindow selectedChat={selectedChat} />}
                </div>
            )}
        </div>
    );
};

export default ChatPage;
