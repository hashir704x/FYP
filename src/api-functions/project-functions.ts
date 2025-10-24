import { supabaseClient } from "@/Supabase-client";
import type {
    ProjectsFromBackendType,
    CreateProjectType,
    ProjectDetailsTypeFromBackend,
} from "@/Types";

import { deleteInvitation } from "./project-invitations-functions";

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
            "*, project_freelancers_join_table(freelancers(id, username, profile_pic, skills, description, role))"
        )
        .eq("project_id", projectId);

    if (error) {
        console.error("Error occurred in getProjectById function", error.message);
        throw new Error(error.message);
    }

    return data[0];
}

export async function addFreelancerToProject({
    clientId,
    freelancerId,
    invitationId,
    projectId,
}: {
    projectId: string;
    clientId: string;
    freelancerId: string;
    invitationId: string;
}): Promise<void> {
    const { error } = await supabaseClient.from("project_freelancers_join_table").insert([
        {
            freelancer_id: freelancerId,
            client_id: clientId,
            project_id: projectId,
        },
    ]);

    if (error) {
        console.error("Error occurred in addFreelancerToProject function", error.message);
        throw new Error(error.message);
    }

    try {
        await deleteInvitation(invitationId);
    } catch (error) {
        console.error("Error occurred in deleteInvitation function");
        throw new Error("Something went wrong, cannot delete invitation");
    }
}
