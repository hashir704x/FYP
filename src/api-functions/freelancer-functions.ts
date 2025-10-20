import { supabaseClient } from "@/Supabase-client";
import { type FreelancerFromBackendType } from "@/Types";

export async function getAllFreelancers(): Promise<FreelancerFromBackendType[]> {
    console.log("getAllFreelancers() called");

    const { data, error } = await supabaseClient
        .from("freelancers")
        .select("id, username, description, skills, profile_pic, role");

    if (error) {
        console.error("Error in getAllFreelancers function:", error.message);
        throw error;
    }
    return data;
}

export async function getFreelancerDataById(
    freelancerId: string
): Promise<FreelancerFromBackendType> {
    const { data, error } = await supabaseClient
        .from("freelancers")
        .select("id, username, role, description, skills, profile_pic")
        .eq("id", freelancerId)
        .single();

    if (error) {
        console.error("Error in getAllFreelancers function:", error.message);
        throw error;
    }

    return data;
}
