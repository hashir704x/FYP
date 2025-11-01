import { supabaseClient } from "@/Supabase-client";
import type { ClientFromBackendType, ClientOwnDataFromBackendType } from "@/Types";

export async function getClientOwnDataById(
    clientId: string
): Promise<ClientOwnDataFromBackendType> {
    console.log("getClientOwnDataById() called");

    const { data, error } = await supabaseClient
        .from("clients")
        .select("*")
        .eq("id", clientId)
        .single();

    if (error) {
        console.error("Error occurred in getClientOwnDataById function", error.message);
        throw new Error(error.message);
    }
    return data;
}

export async function getClientDataById(
    clientId: string
): Promise<ClientFromBackendType> {
    console.log("getClientDataById() called");

    const { data, error } = await supabaseClient
        .from("clients")
        .select("id, username, profile_pic, role")
        .eq("id", clientId)
        .single();
    if (error) {
        console.error("Error occurred in getClientDataById function", error.message);
        throw new Error(error.message);
    }

    return data;
}

export async function updateClientProfileImage(
    file: File,
    clientId: string
): Promise<string> {
    console.log("updateClientProfileImage() called");

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
        .from("clients")
        .update({ profile_pic: imageData.publicUrl })
        .eq("id", clientId);

    if (updateImageError) {
        console.error("Error uploading file:", updateImageError.message);
        throw new Error(updateImageError.message);
    }

    return imageData.publicUrl;
}
