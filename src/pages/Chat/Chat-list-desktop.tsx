// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { chatsStore } from "@/store/chats-store";
// import type { ChatFromBackendType } from "@/Types";

// type PropsType = {
//     chats: ChatFromBackendType[];
// };

// const ChatListDesktop = ({ chats }: PropsType) => {
//     const setActiveChat = chatsStore((state) => state.setActiveChat);
//     const activeChat = chatsStore((state) => state.activeChat);
//     const unreadChatsIds = chatsStore((state) => state.unreadChatsIds);
//     const removeChatIdFromUnreadChatsIds = chatsStore(
//         (state) => state.removeChatIdFromUnreadChatsIds
//     );

//     return (
//         <div className="w-full h-full border-2 flex flex-col">
//             <ScrollArea className="flex-1">
//                 <div className="flex flex-col">
//                     {chats.map((chat) => {
//                         const isActive = activeChat?.id === chat.id;

//                         return (
//                             <div
//                                 key={chat.id}
//                                 onClick={() => setActiveChat(chat)}
//                                 className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-colors border-b
//                             ${isActive && "bg-gray-200"}`}
//                             >
//                                 <div className="relative">
//                                     <Avatar>
//                                         <AvatarImage
//                                             src={chat.userDetails?.profile_pic}
//                                             className="object-cover"
//                                         />
//                                         <AvatarFallback>
//                                             {chat.userDetails?.username?.[0]}
//                                         </AvatarFallback>
//                                     </Avatar>
//                                 </div>

//                                 <div className="flex-1">
//                                     <div className="font-medium">
//                                         {chat.userDetails?.username}
//                                     </div>
//                                     <div className="text-sm text-gray-500 truncate">
//                                         Click to chat with {chat.userDetails?.username}
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </ScrollArea>
//         </div>
//     );
// };

// export default ChatListDesktop;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatsStore } from "@/store/chats-store";
import type { ChatFromBackendType } from "@/Types";

type PropsType = {
    chats: ChatFromBackendType[];
};

const ChatListDesktop = ({ chats }: PropsType) => {
    const setActiveChat = chatsStore((state) => state.setActiveChat);
    const activeChat = chatsStore((state) => state.activeChat);
    const unreadChatsIds = chatsStore((state) => state.unreadChatsIds);
    const removeChatIdFromUnreadChatsIds = chatsStore(
        (state) => state.removeChatIdFromUnreadChatsIds
    );

    return (
        <div className="w-full h-full border-2 flex flex-col">
            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {chats.map((chat) => {
                        const isActive = activeChat?.id === chat.id;
                        const isUnread = unreadChatsIds.includes(chat.id);
                   


                        const handleClick = () => {
                            setActiveChat(chat);
                            if (isUnread) removeChatIdFromUnreadChatsIds(chat.id);
                        };

                        return (
                            <div
                                key={chat.id}
                                onClick={handleClick}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer rounded-lg transition-colors border-b
                                ${
                                    isActive
                                        ? "bg-gray-200"
                                        : isUnread
                                        ? "bg-blue-50 hover:bg-blue-100"
                                        : "hover:bg-gray-100"
                                }`}
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

                                    {isUnread && (
                                        <span className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div
                                        className={`font-medium ${
                                            isUnread
                                                ? "font-semibold text-gray-900"
                                                : "text-gray-800"
                                        }`}
                                    >
                                        {chat.userDetails?.username}
                                    </div>
                                    <div
                                        className={`text-sm truncate ${
                                            isUnread ? "text-gray-700" : "text-gray-500"
                                        }`}
                                    >
                                        {isUnread
                                            ? "New message received!"
                                            : `Click to chat with ${chat.userDetails?.username}`}
                                    </div>
                                </div>

                                {isUnread && (
                                    <div className="flex justify-center items-center">
                                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
};

export default ChatListDesktop;
