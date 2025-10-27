import { getChatsForUser } from "@/api-functions/chat-functions";
import { userAuthStore } from "@/store/user-auth-store";
import type { UserType } from "@/Types";
import { useQuery } from "@tanstack/react-query";

const ChatPage = () => {
    const user = userAuthStore((state) => state.user) as UserType;

    const { data, isError, isLoading } = useQuery({
        queryFn: () =>
            getChatsForUser({
                userId: user.userId,
                userRole: user.role,
                getDetails: true,
            }),
        queryKey: ["get-chats-for-user", user.userId],
    });

    return <div></div>;
};

export default ChatPage;
