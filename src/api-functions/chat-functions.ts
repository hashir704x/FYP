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
