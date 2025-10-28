import { getChatsForUser } from "@/api-functions/chat-functions";
import { Spinner } from "@/components/ui/spinner";
import { userAuthStore } from "@/store/user-auth-store";
import { type ChatFromBackendType, type UserType } from "@/Types";
// import { useQuery } from "@tanstack/react-query";
import ChatDesktop from "./Chat-desktop";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/Supabase-client";

const ChatPage = () => {
    const user = userAuthStore((state) => state.user) as UserType;
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [chats, setChats] = useState<ChatFromBackendType[]>([]);

    useEffect(() => {
        const column = user.role === "client" ? "client_id" : "freelancer_id";

        (async function () {
            setIsLoading(true);
            try {
                const response = await getChatsForUser({
                    userId: user.userId,
                    userRole: user.role,
                    getDetails: true,
                });
                setChats(response);
            } catch (error) {
                console.error(error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        })();

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
                    setChats((prev) => [payload.new as ChatFromBackendType, ...prev]);
                }
            )
            .subscribe();

        return function () {
            supabaseClient.removeChannel(chatsChannel);
        };
    }, []);

    console.log("chatss:", chats);

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

            {chats.length === 0 && <div>You have no chats right now</div>}

            {chats.length >= 1 && (
                <div>
                    <div className="hidden lg:block">
                        <ChatDesktop chats={chats} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatPage;
