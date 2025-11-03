import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatFromBackendType } from "@/Types";

type PropsType = {
    chats: ChatFromBackendType[];
    activeChat: ChatFromBackendType | null;
    setActiveChat: React.Dispatch<React.SetStateAction<ChatFromBackendType | null>>;
};

const ChatListDesktop = ({ chats, activeChat, setActiveChat }: PropsType) => {
    return (
        <div className="w-full h-full border-2 flex flex-col">
            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {chats.map((chat) => {
                        const isActive = activeChat?.id === chat.id;

                        return (
                            <div
                                key={chat.id}
                                onClick={() => setActiveChat(chat)}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-colors border-b
                            ${isActive && "bg-gray-200"}`}
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
                                </div>

                                <div className="flex-1">
                                    <div className="font-medium">
                                        {chat.userDetails?.username}
                                    </div>
                                    <div className="text-sm text-gray-500 truncate">
                                        Click to chat with {chat.userDetails?.username}
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
