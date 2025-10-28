import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
// import { Textarea } from "@/components/ui/textarea";
import type { ChatFromBackendType } from "@/Types";
// import { SendHorizonal } from "lucide-react";
import { useState } from "react";

type PropsType = {
    chats: ChatFromBackendType[];
};

const ChatDesktop = (props: PropsType) => {
    const [selectedChat, setSelectedChat] = useState<ChatFromBackendType>(props.chats[0]);
    // const [newMessage, setNewMessage] = useState("");

    // console.log("sc:", selectedChat.userDetails)

    return (
        <div className="flex h-[calc(100vh-70px)] border-t border-gray-200">
            {/* Left: Chat List */}
            <div className="w-72 border-r border-gray-200 flex flex-col">
                <ScrollArea className="flex-1">
                    <div className="flex flex-col">
                        {props.chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                                    selectedChat.id === chat.id && "bg-gray-100"
                                }`}
                            >
                                <Avatar>
                                    <AvatarImage src={chat.userDetails?.profile_pic} />
                                    <AvatarFallback>
                                        {chat.userDetails?.username[0]}
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
        </div>
    );
};

export default ChatDesktop;

// {/* Right: Messages
// <div className="flex-1 flex flex-col">
//     <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-200 font-semibold text-lg">
//         <Avatar>
//             <AvatarImage src={selectedChat.userDetails?.profile_pic} />
//             <AvatarFallback>
//                 {selectedChat.userDetails?.username}
//             </AvatarFallback>
//         </Avatar>
//         <span>{selectedChat.userDetails?.username}</span>
//     </div>
//     <ScrollArea className="flex-1 p-6 space-y-4">
//         <div className="flex justify-start">
//             <div className="px-4 py-2 rounded-lg bg-gray-100 text-gray-900 max-w-xs">
//                 Hello! This is a dummy message.
//             </div>
//         </div>
//         <div className="flex justify-end">
//             <div className="px-4 py-2 rounded-lg bg-[var(--my-blue)] text-white max-w-xs">
//                 Hi! Reply from me.
//             </div>
//         </div>
//     </ScrollArea>

//     <div className="border-t border-gray-200 p-4 flex items-center gap-3">
//         <Textarea
//             placeholder="Type a message..."
//             value={newMessage}
//             onChange={(e) => setNewMessage(e.target.value)}
//             className="flex-1 resize-none"
//             rows={1}
//         />
//         <Button
//             className="flex items-center gap-2 bg-[var(--my-blue)] hover:bg-[var(--my-blue-light)] px-4 py-2"
//             onClick={() => setNewMessage("")}
//         >
//             <SendHorizonal className="w-4 h-4" />
//             Send
//         </Button>
//     </div>
// </div> */}
