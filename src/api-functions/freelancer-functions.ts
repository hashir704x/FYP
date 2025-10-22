import { supabaseClient } from "@/Supabase-client";
import {
    type FreelancerFromBackendType,
    type FreelancerOwnDataFromBackendType,
} from "@/Types";

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

export async function getFreelancerOwnDataById(): Promise<FreelancerOwnDataFromBackendType> {
    console.log("getFreelancerOwnDataById() called");

    const { error, data } = await supabaseClient.from("freelancers").select("*").single();

    if (error) {
        console.error(
            "Error occurred in getFreelancerOwnDataById function",
            error.message
        );
        throw new Error(error.message);
    }

    return data;
}

export async function updateFreelancerProfileImage(
    file: File,
    freelancerId: string
): Promise<string> {
    console.log("updateFreelancerProfileImage() called");

    const fileName = `${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabaseClient.storage
        .from("project-media")
        .upload(`profile-pics/${fileName}`, file, {
            upsert: false,
            cacheControl: "3600",
        });

    if (uploadError) {
        console.error("Error uploading file:", uploadError.message);
        throw new Error(uploadError.message);
    }

    const { data: imageData } = supabaseClient.storage
        .from("project-media")
        .getPublicUrl(`profile-pics/${fileName}`);

    if (!imageData.publicUrl) {
        throw new Error("Image upload failed");
    }

    const { error: updateImageError } = await supabaseClient
        .from("freelancers")
        .update({ profile_pic: imageData.publicUrl })
        .eq("id", freelancerId);

    if (updateImageError) {
        console.error("Error uploading file:", updateImageError.message);
        throw new Error(updateImageError.message);
    }

    return imageData.publicUrl;
}
