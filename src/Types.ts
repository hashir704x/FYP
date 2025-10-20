export type UserRoleType = "client" | "freelancer";

export type UserType = {
    userId: string;
    username: string;
    email: string;
    role: UserRoleType;
    wallet_amount: number;
    profile_pic: string;
};

export type UserAuthStoreType = {
    user: UserType | null;
    userExists: boolean;
    setUser: (user: UserType) => void;
    reset: () => void;
};

export type CreateProjectType = {
    project_title: string;
    project_description: string;
    project_budget: number;
    required_skills: string[];
    client_id: string;
};

export type ProjectsFromBackendType = {
    project_id: string;
    client_id: string;
    project_title: string;
    project_description: string;
    project_budget: number;
    project_status: "DRAFT" | "IN_PROGRESS" | "COMPLETED";
    required_skills: string[];
    created_at: string;
};

export type ClientProfileFromBackendType = {
    id: string;
    username: string;
    email: string;
    role: string;
    profile_pic: string;
    wallet_amount: number;
    created_at: string;
};

export type FreelancerFromBackendType = {
    id: string;
    username: string;
    description: string;
    skills: string[];
    profile_pic: string;
    role: string;
};

export type InvitationsFromBackendType = {
    id: string;
    project_id: string;
    client_id: string;
    created_at: string;
    projects: {
        project_id: string;
        project_title: string;
        project_description: string;
        required_skils: string[];
    }[];
    clients: {
        id: string;
        email: string;
        username: string;
        profile_pic: string;
    }[];
};

export type ProjectDetailsTypeFromBackend = {
    project_id: string;
    project_title: string;
    project_description: string;
    project_budget: number;
    client_id: string;
    created_at: string;
    required_skills: string[];

    project_freelancers_join_table: {
        freelancers: {
            id: string;
            username: string;
            email: string;
            profile_pic: string;
            skills: string[];
            description: string;
        };
    }[];
};

export type InvitationsForProjectFromBackendType = {
    id: string;
    created_at: string;
    freelancers: {
        id: string;
        role: string;
        email: string;
        username: string;
        profile_pic: string;
        skills: string[];
    };
};
