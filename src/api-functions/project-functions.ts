import { supabaseClient } from "@/Supabase-client";
import type {
    ProjectsFromBackendType,
    CreateProjectType,
    ProjectDetailsTypeFromBackend,
} from "@/Types";

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

export async function getProjectById(
    projectId: string
): Promise<ProjectDetailsTypeFromBackend> {
    console.log("getProjectById() called");

    const { data, error } = await supabaseClient
        .from("projects")
        .select(
            "*, project_freelancers_join_table(*, freelancers(id, username, profile_pic, skills, description))"
        )
        .eq("project_id", projectId);

    if (error) {
        console.error("Error occurred in getProjectById function", error.message);
        throw new Error(error.message);
    }

    return data[0];
}
