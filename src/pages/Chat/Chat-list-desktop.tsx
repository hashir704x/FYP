import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatsStore } from "@/store/chats-store";
import type { ChatFromBackendType } from "@/Types";

type PropsType = {
    chats: ChatFromBackendType[];
};

const ChatListDesktop = ({ chats }: PropsType) => {
    const activeChat = chatsStore((state) => state.activeChat);
    const setActiveChat = chatsStore((state) => state.setActiveChat);
    const unreadChatsIds = chatsStore((state) => state.unreadChatsIds);

    return (
        <div className="w-72 border-r border-gray-200 flex flex-col">
            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {chats.map((chat) => {
                        const isUnread = unreadChatsIds.includes(chat.id);
                        const isActive = activeChat?.id === chat.id;

                        return (
                            <div
                                key={chat.id}
                                onClick={() => setActiveChat(chat)}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-colors
                            ${isActive ? "bg-gray-200" : ""}
                            ${isUnread && !isActive ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-50"}
                          `}
                            >
                                <div className="relative">
                                    <Avatar>
                                        <AvatarImage
                                            src={chat.userDetails?.profile_pic}
                                            className="object-cover"
                                        />
                                        <AvatarFallback>
                                            {chat.userDetails?.username?.[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    {isUnread && !isActive && (
                                        <span className="absolute top-0 -right-1 block w-3 h-3 bg-[var(--my-blue)] rounded-full ring-1 ring-white" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div
                                        className={`font-medium ${isUnread && !isActive ? "font-semibold text-gray-900" : ""}`}
                                    >
                                        {chat.userDetails?.username}
                                    </div>
                                    <div className="text-sm text-gray-500 truncate">
                                        Click to chat with{" "}
                                        {chat.userDetails?.username}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
};

export default ChatListDesktop;
