import { supabaseClient } from "@/Supabase-client";
import type { ClientProfileFromBackendType } from "@/Types";

export async function getClientProfileData(): Promise<ClientProfileFromBackendType> {
    const { data, error } = await supabaseClient
        .from("clients")
        .select("*")
        .single();

    if (error) {
        console.error("Error occurred in getClientProfileData function", error.message);
        throw new Error(error.message);
    }
    return data;
}
