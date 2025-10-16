import { supabaseClient } from "@/Supabase-client";
import type { ProjectsFromBackendType, CreateProjectType } from "@/Types";

export async function getAllProjectsForClient(): Promise<ProjectsFromBackendType[]> {
    console.log("getAllProjectsForClient() called");

    const { data, error } = await supabaseClient
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error(
            "Error occurred in getAllProjectsForClient function",
            error.message
        );
        throw new Error(error.message);
    }
    return data;
}

export async function createProject(projectData: CreateProjectType): Promise<string> {
    console.log("createProject() called");

    const { data, error } = await supabaseClient
        .from("projects")
        .insert([
            {
                ...projectData,
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Error occurred in createProject function", error.message);
        throw new Error(error.message);
    }

    return data.project_id;
}
