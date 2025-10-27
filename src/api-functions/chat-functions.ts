import { supabaseClient } from "@/Supabase-client";
import { type ChatFromBackendType } from "@/Types";

export async function getChatsForUser({
    userId,
    userRole,
    getDetails,
}: {
    userId: string;
    userRole: "freelancer" | "client";
    getDetails: boolean;
}): Promise<ChatFromBackendType[]> {
    console.log("getChatsForUser() called");

    const column = userRole === "client" ? "client_id" : "freelancer_id";

    const { data, error } = await supabaseClient
        .from("chats")
        .select("*")
        .eq(column, userId)
        .order("created_at", { ascending: false });
    if (error) {
        console.error("Error occurred in getChatsForUser function", error.message);
        throw new Error(error.message);
    }

    if (!getDetails) return data;

    const otherUserColumn = userRole === "client" ? "freelancer_id" : "client_id";
    const otherUserIds = data.map((chat) => chat[otherUserColumn]);
    const otherUserTable = userRole === "client" ? "freelancers" : "clients";

    const { data: usersData, error: usersError } = await supabaseClient
        .from(otherUserTable)
        .select("id, username, profile_pic")
        .in("id", otherUserIds);
    if (usersError) {
        console.error("Error occurred in getChatsForUser function", usersError.message);
        throw new Error(usersError.message);
    }

    const chatsWithUserDetails = data.map((chat) => {
        const userDetails = usersData.find((user) => user.id === chat[otherUserColumn]);
        return { ...chat, userDetails };
    });

    return chatsWithUserDetails;
}

export async function createChatAndInsertMessage({
    freelancerId,
    clientId,
    message,
}: {
    freelancerId: string;
    clientId: string;
    message: string;
}): Promise<string> {
    console.log("createChatAndInsertMessage() called");

    // creating chat
    const { data, error } = await supabaseClient
        .from("chats")
        .insert([{ freelancer_id: freelancerId, client_id: clientId }])
        .select()
        .single();

    if (error) {
        console.error(
            "Error occurred in createChatAndInsertMessage function",
            error.message
        );
        throw new Error(error.message);
    }
    console.log("Chat data response:", data);

    // inserting first message
    const { data: messageResponse, error: messageError } = await supabaseClient
        .from("messages")
        .insert([
            {
                chat_id: data.id,
                freelancer_id: freelancerId,
                client_id: clientId,
                message_text: message,
            },
        ])
        .select()
        .single();

    if (messageError) {
        console.error(
            "Error occurred in createChatAndInsertMessage function",
            messageError.message
        );
        throw new Error(messageError.message);
    }

    console.log("Message data response:", messageResponse);
    return data.id;
}
