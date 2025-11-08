import { supabaseClient } from "@/Supabase-client";

export async function getAllNotifications(userId: string) {
    console.log("getAllNotifications() called");

    const { data, error } = await supabaseClient
        .from("notifications")
        .select("*")
        .eq("to_user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error in getAllNotifications function:", error.message);
        throw error;
    }

    const notificationsWithSenderData = await Promise.all(
        data.map(async (noti) => {
            let senderData = null;
            if (noti.from_user_profile === "client") {
                const { data: userData, error: userError } = await supabaseClient
                    .from("clients")
                    .select("id, username, profile_pic")
                    .eq("id", noti.from_user_id)
                    .single();
                senderData = userData;
                if (userError) throw userError;
            } else if (noti.from_user_profile === "freelancers") {
                const { data: userData, error: userError } = await supabaseClient
                    .from("freelancers")
                    .select("id, username, profile_pic")
                    .eq("id", noti.from_user_id)
                    .single();
                senderData = userData;
                if (userError) throw userError;
            }

            return { ...noti, sender: senderData };
        })
    );

    return notificationsWithSenderData;
}

export async function createNotification(payload: {
    from_user_id: string | null;
    from_user_role: string | null;
    to_user_id: string;
    to_user_role: "client" | "freelancer";
    title: string;
    body: string;
    type: string;
}): Promise<void> {
    console.log("createNotification() called");

    const { error } = await supabaseClient.from("notifications").insert([payload]);
    if (error) {
        console.error("Error in createNotification function:", error.message);
        throw error;
    }
}

export async function deleteAllNotifications(userId: string): Promise<void> {
    console.log("deleteAllNotifications() called");

    const { error } = await supabaseClient
        .from("notifications")
        .delete()
        .eq("to_user_id", userId);
    if (error) {
        console.error("Error in deleteAllNotifications function:", error.message);
        throw error;
    }
}
