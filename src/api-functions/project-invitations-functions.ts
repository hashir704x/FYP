import { supabaseClient } from "@/Supabase-client";
import {
    type InvitationsForFreelancerFromBackendType,
    type InvitationsForProjectFromBackendType,
} from "@/Types";

export async function sendInvitation({
    clientId,
    projectId,
    freelancerId,
}: {
    clientId: string;
    projectId: string;
    freelancerId: string;
}): Promise<void> {
    console.log("sendInvitation() called");

    const { error } = await supabaseClient.from("invitations").insert([
        {
            client_id: clientId,
            project_id: projectId,
            freelancer_id: freelancerId,
        },
    ]);

    if (error) {
        console.error("Error sending invitation:", error.message);
        throw new Error(error.message);
    }
}

export async function getInvitationsForFreelancer(
    freelancerId: string
): Promise<InvitationsForFreelancerFromBackendType[]> {
    console.log("getInvitationsForFreelancer() called");

    const { error, data } = await supabaseClient
        .from("invitations")
        .select(
            "id, project_id, client_id, created_at, projects(project_id, project_title, project_description, required_skils), clients(id, email, username, profile_pic)"
        )
        .eq("freelancer_id", freelancerId);

    if (error) {
        console.error("Error getting invitations for freelancer:", error.message);
        throw new Error(error.message);
    }

    return data;
}

export async function getInvitationsForProject(
    projectId: string
): Promise<InvitationsForProjectFromBackendType[]> {
    console.log("getInvitationsForProject() called");

    const { data, error } = await supabaseClient
        .from("invitations")
        .select(
            "id, created_at, project_id, freelancers(id, username, email, role, skills, profile_pic)"
        )
        .eq("project_id", projectId);

    if (error) {
        console.error("Error getting invitations for project:", error.message);
        throw new Error(error.message);
    }
    return data as unknown as InvitationsForProjectFromBackendType[];
}

export async function deleteInvitation(invitationId: string): Promise<void> {
    console.log("deleteInvitation() called");

    const { error } = await supabaseClient
        .from("invitations")
        .delete()
        .eq("id", invitationId);

    if (error) {
        console.error("Error deleting invitation:", error.message);
        throw new Error(error.message);
    }
}
