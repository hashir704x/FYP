import { supabaseClient } from "@/Supabase-client";
import type { ChatFromBackendType, MessageFromBackendType } from "@/Types";
import { getMessagesForChat, sendMessage } from "@/api-functions/chat-functions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState, useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import { updateLastReadMessage } from "@/api-functions/chat-functions";
import ShareFileDialog from "./Share-file-dialog";

type PropsType = {
    userId: string;
    userRole: "client" | "freelancer";
    activeChat: ChatFromBackendType;
};

const ChatWindow = (props: PropsType) => {
    const [openShareFileDialog, setOpenShareFileDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [messages, setMessages] = useState<MessageFromBackendType[]>([]);

    const [isError, setIsError] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const messagesRef = useRef<null | number>(null);

    const [targetFile, setTargetFile] = useState<null | File>(null);

    const [sendingMessageLoading, setSendingMessageLoading] = useState(false);

    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        (async function () {
            try {
                setIsLoading(true);
                const messagesData = await getMessagesForChat(props.activeChat.id);
                setMessages(messagesData);
            } catch (error) {
                console.error(error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        })();

        const channel = supabaseClient
            .channel(`chat_${props.activeChat.id}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `chat_id=eq.${props.activeChat.id}`,
                },
                (payload) => {
                    const newMessage = payload.new as MessageFromBackendType;
                    setMessages((prev) => [...prev, newMessage]);
                }
            )
            .subscribe();

        return function () {
            console.log("Unsubscribing chat window channel");
            if (channel) supabaseClient.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        if (messages.length > 0) {
            messagesRef.current = messages[messages.length - 1].id;
        }
    }, [messages]);

    useEffect(() => {
        return function () {
            (async function () {
                if (messagesRef.current)
                    await updateLastReadMessage(
                        props.activeChat.id,
                        props.userRole,
                        messagesRef.current
                    );
            })();
        };
    }, []);

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return;

        setTargetFile(e.target.files[0]);
        setOpenShareFileDialog(true);
        e.target.value = "";
    }

    console.log(openShareFileDialog);

    const handleSend = async () => {
        if (!inputValue.trim()) return;
        try {
            if (props.activeChat) {
                setSendingMessageLoading(true);
                await sendMessage(
                    props.activeChat.id,
                    props.activeChat.freelancer_id,
                    props.activeChat.client_id,
                    props.userRole,
                    inputValue.trim()
                );
                setInputValue("");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSendingMessageLoading(false);
        }
    };

    if (isError)
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                Failed to load messages.
            </div>
        );

    return (
        <div className="flex flex-col w-full h-full bg-white shadow-sm overflow-hidden">
            {props.activeChat && props.activeChat.userDetails && (
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                    <Avatar className="h-11 w-11 border">
                        <AvatarImage
                            src={props.activeChat.userDetails?.profile_pic}
                            alt={props.activeChat.userDetails.username}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                            {props.activeChat.userDetails.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <span className="font-semibold text-gray-900 text-lg">
                        {props.activeChat.userDetails.username}
                    </span>
                </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-b from-gray-50 to-white space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Spinner className="text-[var(--my-blue)] w-8 h-8" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-gray-400 text-center py-10">No messages yet</div>
                ) : (
                    messages.map((item) => {
                        const isSentByCurrentUser = props.userRole === item.sender_role;

                        return (
                            <div
                                key={item.id}
                                className={`flex ${
                                    isSentByCurrentUser ? "justify-end" : "justify-start"
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
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

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
                    <label className="cursor-pointer p-2 rounded-xl hover:bg-gray-200 transition flex items-center justify-center">
                        <Paperclip
                            size={20}
                            className="text-gray-600 hover:text-gray-800"
                        />
                        <input
                            type="file"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        {targetFile && (
                            <ShareFileDialog
                                openShareFileDialog={openShareFileDialog}
                                setOpenShareFileDialog={setOpenShareFileDialog}
                                targetFile={targetFile}
                                setTargetFile={setTargetFile}
                            />
                        )}
                    </label>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
