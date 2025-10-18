import { supabaseClient } from "@/Supabase-client";
import { type InvitationsFromBackendType } from "@/Types";

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

    console.log(clientId, projectId, freelancerId);

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

export async function getFreelancerInvitations(
    freelancerId: string
): Promise<InvitationsFromBackendType[]> {
    console.log("getFreelancerInvitations() called");

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
