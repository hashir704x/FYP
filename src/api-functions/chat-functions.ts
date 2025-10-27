import { supabaseClient } from "@/Supabase-client";
import { type ChatFromBackendType } from "@/Types";

export async function getChatsForUser(userId: string): Promise<ChatFromBackendType[]> {
    console.log("getChatsForUser() called");

    const { data, error } = await supabaseClient
        .from("chats")
        .select("*")
        .or(`user_1.eq.${userId},user_2.eq.${userId}`)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error occurred in getChatsForUser function", error.message);
        throw new Error(error.message);
    }

    return data;
}

export async function createChatAndInsertMessage({
    senderId,
    receiverId,
    message,
}: {
    senderId: string;
    receiverId: string;
    message: string;
}): Promise<string> {
    console.log("createChatAndInsertMessage() called");

    // creating chat
    const { data, error } = await supabaseClient
        .from("chats")
        .insert([{ user_1: senderId, user_2: receiverId }])
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
                sender_id: senderId,
                receiver_id: receiverId,
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
