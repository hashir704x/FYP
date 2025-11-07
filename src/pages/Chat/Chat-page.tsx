import ChatListDesktop from "./Chat-list-desktop";

import ChatWindow from "./Chat-window";
import { MessageSquare } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { chatsStore } from "@/store/chats-store";
import { useEffect } from "react";
// import { useSearchParams } from "react-router-dom";

const ChatPage = () => {
    // const [searchParams] = useSearchParams();
    const isMobile = useIsMobile();
    const chats = chatsStore((state) => state.chatsDataArray);
    const activeChat = chatsStore((state) => state.activeChat);
    const setActiveChat = chatsStore((state) => state.setActiveChat);
    
    useEffect(() => {
        return function () {
            setActiveChat(null);
        };
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-semibold h-[70px] px-4 justify-center md:justify-start border-b flex items-center">
                Chats
            </h1>

            {chats.length === 0 && <div>You have no chats right now</div>}

            {chats && chats.length >= 1 && (
                <div>
                    {isMobile ? (
                        <div className="h-[calc(100vh-70px)]">
                            {!activeChat ? (
                                <div className="h-full ">
                                    <ChatListDesktop />
                                </div>
                            ) : (
                                <div className="h-full">
                                    <ChatWindow key={activeChat.id} />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-[calc(100vh-70px)] flex">
                            <div className="min-w-72 h-full ">
                                <ChatListDesktop />
                            </div>
                            {activeChat ? (
                                <ChatWindow key={activeChat.id} />
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
