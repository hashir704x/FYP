import { supabaseClient } from "@/Supabase-client";
import {
    getMessagesForProject,
    sendProjectChatMessage,
} from "@/api-functions/chat-functions";
import type { ProjectMessageFromBackendType, UserType } from "@/Types";
import { Spinner } from "@/components/ui/spinner";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { MessageSquare, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { userAuthStore } from "@/store/user-auth-store";
import { getProjectById } from "@/api-functions/project-functions";
import { useQuery } from "@tanstack/react-query";

const ProjectChatPage = () => {
    const { projectId } = useParams();
    const user = userAuthStore((state) => state.user) as UserType;

    const [messages, setMessages] = useState<ProjectMessageFromBackendType[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [sendingMessageLoading, setSendingMessageLoading] = useState(false);

    const {
        data,
        isLoading: extraDataLoading,
        isError: extraDataError,
    } = useQuery({
        queryFn: () => getProjectById(projectId as string),
        queryKey: ["get-project-details", projectId],
    });

    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        let channel: RealtimeChannel;
        (async function () {
            try {
                setIsLoading(true);
                const messagesData = await getMessagesForProject(projectId as string);
                setMessages(messagesData);

                channel = supabaseClient
                    .channel(`project_chat_${projectId}`)
                    .on(
                        "postgres_changes",
                        {
                            event: "INSERT",
                            schema: "public",
                            table: "project_messages",
                            filter: `project_id=eq.${projectId}`,
                        },
                        (payload) => {
                            const newMessage =
                                payload.new as ProjectMessageFromBackendType;
                            setMessages((prev) => [...prev, newMessage]);
                        }
                    )
                    .subscribe();
            } catch (error) {
                console.error(error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        })();

        return () => {
            if (channel) supabaseClient.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;
        try {
            setSendingMessageLoading(true);
            await sendProjectChatMessage(
                projectId as string,
                user.userId,
                user.username,
                inputValue.trim()
            );
            setInputValue("");
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setSendingMessageLoading(false);
        }
    };

    if (isError)
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                Failed to load project messages.
            </div>
        );

    return (
        <div className="flex flex-col lg:flex-row h-screen w-full bg-white shadow-sm overflow-hidden">
            {/* Chat Section */}
            <div className="flex flex-col flex-1">
                <h1 className="text-3xl font-semibold h-[70px] px-4 border-b justify-center md:justify-start flex items-center">
                    Project Chat
                </h1>

                {/* Scrollable messages area */}
                <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 ">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-[90%]">
                            <Spinner className="text-[var(--my-blue)] w-8 h-8" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center mt-[20%] text-gray-400">
                            <div className="bg-[var(--my-blue)]/10 p-4 rounded-full shadow-sm">
                                <MessageSquare
                                    size={30}
                                    className="text-[var(--my-blue)]"
                                />
                            </div>
                            <p className="mt-4 text-lg font-medium text-gray-600">
                                No messages yet
                            </p>
                            <p className="text-sm text-gray-400">
                                Start the conversation by sending a message
                            </p>
                        </div>
                    ) : (
                        messages.map((msg) => {
                            const isSentByUser = msg.sender_id === user.userId;

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${
                                        isSentByUser ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[75%] sm:max-w-[70%] md:max-w-[60%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                            isSentByUser
                                                ? "bg-[var(--my-blue)] text-white rounded-tr-none"
                                                : "bg-gray-200 text-gray-800 rounded-tl-none"
                                        }`}
                                    >
                                        {!isSentByUser && (
                                            <div className="text-xs text-gray-500 mb-1 font-medium">
                                                {msg.sender_username}
                                            </div>
                                        )}
                                        <p className="whitespace-pre-wrap break-words">
                                            {msg.message_text}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input Bar */}
                <div className="flex-none border-t border-gray-200 p-3 bg-gray-50">
                    <div className="flex items-center gap-2">
                        <input
                            disabled={sendingMessageLoading}
                            type="text"
                            placeholder="Type a message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all text-sm sm:text-base"
                        />
                        <button
                            disabled={sendingMessageLoading || !inputValue.trim()}
                            onClick={handleSend}
                            className="disabled:bg-[var(--my-blue)]/50 p-2 rounded-xl bg-[var(--my-blue)] hover:bg-[var(--my-blue-light)] transition text-white"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="hidden lg:flex flex-col w-[300px] border-l bg-gray-50 p-4 overflow-y-auto">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                    Project Members
                </h2>

                {extraDataLoading ? (
                    <div className="flex justify-center py-10">
                        <Spinner className="text-[var(--my-blue)] w-7 h-7" />
                    </div>
                ) : extraDataError || !data ? (
                    <p className="text-red-500 text-sm">Failed to load members</p>
                ) : (
                    <div className="space-y-6">
                        {/* Client Section */}
                        <div className="border-b pb-4">
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">
                                Client
                            </h3>
                            <div className="flex items-center gap-3">
                                <img
                                    src={data.clients.profile_pic}
                                    alt="client-pic"
                                    className="w-12 h-12 rounded-full object-cover border-2 border-[var(--my-blue)]"
                                />
                                <div>
                                    <p className="font-medium text-gray-800">
                                        {data.clients.username}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {data.clients.role}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Freelancers Section */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600 mb-2">
                                Freelancers
                            </h3>
                            {data.project_freelancers_join_table.length === 0 ? (
                                <p className="text-gray-400 text-sm">
                                    No freelancers yet
                                </p>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {data.project_freelancers_join_table.map((f) => (
                                        <div
                                            key={f.freelancers.id}
                                            className="flex items-center gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-2 hover:shadow-md transition-all duration-200"
                                        >
                                            <img
                                                src={f.freelancers.profile_pic}
                                                alt="freelancer-pic"
                                                className="w-10 h-10 rounded-full object-cover border"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-800">
                                                    {f.freelancers.username}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {f.freelancers.role}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectChatPage;
