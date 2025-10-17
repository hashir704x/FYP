import { supabaseClient } from "@/Supabase-client";
import { type FreelancerFromBackendType } from "@/Types";

export async function getAllFreelancers(): Promise<FreelancerFromBackendType[]> {
    const { data, error } = await supabaseClient
        .from("freelancers")
        .select("id, username, email, role, description, skills, profile_pic");

    if (error) {
        console.error("Error in getAllFreelancers function:", error.message);
        throw error;
    }
    return data;
}
