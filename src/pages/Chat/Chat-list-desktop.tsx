
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ChatFromBackendType } from "@/Types";

type PropsType = {
    chats: ChatFromBackendType[];
    selectedChatId: string | null;
    // onSelectChat: (chat: ChatFromBackendType) => void;
    setSelectedChat: React.Dispatch<React.SetStateAction<ChatFromBackendType | null>>
};

const ChatListDesktop = ({ chats, selectedChatId, setSelectedChat }: PropsType) => {
    return (
        <div className="w-72 border-r border-gray-200 flex flex-col">
            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {chats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                                selectedChatId === chat.id ? "bg-gray-100" : ""
                            }`}
                        >
                            <Avatar>
                                <AvatarImage src={chat.userDetails?.profile_pic} />
                                <AvatarFallback>
                                    {chat.userDetails?.username?.[0]}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <div className="font-medium">
                                    {chat.userDetails?.username}
                                </div>
                                <div className="text-sm text-gray-500 truncate">
                                    Click to chat with {chat.userDetails?.username}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default ChatListDesktop;
