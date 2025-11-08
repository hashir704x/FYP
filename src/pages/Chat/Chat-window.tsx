import { supabaseClient } from "@/Supabase-client";
import type {
    ChatFromBackendType,
    MessageFromBackendType,
    UserType,
} from "@/Types";
import {
    getMessagesForChat,
    sendMessage,
} from "@/api-functions/chat-functions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useState, useRef } from "react";
import { Download, FileText, Paperclip, Send } from "lucide-react";
import { updateLastReadMessage } from "@/api-functions/chat-functions";
import ShareFileDialog from "./Share-file-dialog";
import { userAuthStore } from "@/store/user-auth-store";
import { chatsStore } from "@/store/chats-store";
import ImageViewPopup from "./Image-view-popup";

const ChatWindow = () => {
    const [openShareFileDialog, setOpenShareFileDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const user = userAuthStore((state) => state.user) as UserType;
    const activeChat = chatsStore(
        (state) => state.activeChat
    ) as ChatFromBackendType;

    const [messages, setMessages] = useState<MessageFromBackendType[]>([]);

    const [isError, setIsError] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const messagesRef = useRef<null | number>(null);

    const [targetFile, setTargetFile] = useState<null | File>(null);

    const [sendingMessageLoading, setSendingMessageLoading] = useState(false);

    const [showImageView, setShowImageView] = useState(false);
    const [imageViewUrl, setImageViewUrl] = useState<null | string>(null);

    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        (async function () {
            try {
                setIsLoading(true);
                const messagesData = await getMessagesForChat(activeChat.id);
                setMessages(messagesData);
            } catch (error) {
                console.error(error);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        })();

        const channel = supabaseClient
            .channel(`chat_${activeChat.id}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `chat_id=eq.${activeChat.id}`,
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
                        activeChat.id,
                        user.role,
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

    const handleSend = async () => {
        if (!inputValue.trim()) return;
        try {
            setSendingMessageLoading(true);
            await sendMessage(
                activeChat.id,
                activeChat.freelancer_id,
                activeChat.client_id,
                user.role,
                inputValue.trim()
            );
            setInputValue("");
        } catch (error) {
            console.error(error);
        } finally {
            setSendingMessageLoading(false);
        }
    };

    function handleFileDownload(url: string, fileType: string) {
        fetch(url)
            .then((res) => res.blob())
            .then((blob) => {
                const blobUrl = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = `file.${fileType}`; // file name and extension
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(blobUrl);
            })
            .catch((err) => console.error("Download failed:", err));
    }

    if (isError)
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                Failed to load messages.
            </div>
        );

    return (
        <div className="flex flex-col w-full h-full bg-white shadow-sm overflow-hidden">
            {activeChat.userDetails && (
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
                    <Avatar className="h-11 w-11 border">
                        <AvatarImage
                            src={activeChat.userDetails.profile_pic}
                            alt={activeChat.userDetails.username}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-gray-200 text-gray-600">
                            {activeChat.userDetails.username?.[0]?.toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <span className="font-semibold text-gray-900 text-lg">
                        {activeChat.userDetails.username}
                    </span>
                </div>
            )}

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
                            user.role === item.sender_role;

                        return (
                            <div
                                key={item.id}
                                className={`flex ${
                                    isSentByCurrentUser
                                        ? "justify-end"
                                        : "justify-start"
                                } mb-3`}
                            >
                                {item.file_type ? (
                                    <div>
                                        {item.file_type.match(
                                            /(jpg|jpeg|png|webp)$/i
                                        ) ? (
                                            <img
                                                src={item.message_text}
                                                alt="shared file"
                                                className={`rounded-xl border shadow-md w-[350px] cursor-pointer transition-transform hover:scale-105`}
                                                onClick={() => {
                                                    setImageViewUrl(
                                                        item.message_text
                                                    );
                                                    setShowImageView(true);
                                                }}
                                            />
                                        ) : (
                                            <div
                                                onClick={() =>
                                                    handleFileDownload(
                                                        item.message_text,
                                                        item.file_type as string
                                                    )
                                                }
                                                className={`group flex flex-col items-center justify-center gap-2 px-6 py-4 rounded-2xl shadow-sm transition-all
                ${
                    isSentByCurrentUser
                        ? "bg-[var(--my-blue)] text-white hover:bg-[var(--my-blue-light)]"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
                                            >
                                                {/* File & Download icons */}
                                                <div className="flex items-center gap-3 text-3xl">
                                                    <FileText
                                                        size={28}
                                                        className={`transition-transform group-hover:scale-110 ${
                                                            isSentByCurrentUser
                                                                ? "text-white"
                                                                : "text-gray-700"
                                                        }`}
                                                    />
                                                    <Download
                                                        size={26}
                                                        className={`transition-transform group-hover:scale-110 ${
                                                            isSentByCurrentUser
                                                                ? "text-white"
                                                                : "text-gray-700"
                                                        }`}
                                                    />
                                                </div>

                                                {/* File type text */}
                                                <span className="font-semibold text-sm capitalize">
                                                    {item.file_type.toUpperCase()}{" "}
                                                    File
                                                </span>

                                                {/* Subtext */}
                                                <span
                                                    className={`text-xs ${
                                                        isSentByCurrentUser
                                                            ? "text-white/80"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    Click to download
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                            isSentByCurrentUser
                                                ? "bg-[var(--my-blue)] text-white rounded-tr-none"
                                                : "bg-gray-200 text-gray-800 rounded-tl-none"
                                        }`}
                                    >
                                        <p className="whitespace-pre-wrap break-words">
                                            {item.message_text}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
                <div ref={bottomRef} />
            </div>

            <div className="border-t border-gray-200 p-3 bg-gray-50">
                <div className="flex items-center gap-2">
                    <ImageViewPopup
                        imageViewUrl={imageViewUrl}
                        setImageViewUrl={setImageViewUrl}
                        setShowImageView={setShowImageView}
                        showImageView={showImageView}
                    />
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
