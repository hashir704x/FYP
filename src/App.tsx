import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "./components/ui/sonner";

// Public Pages
const LandingPage = lazy(
    () => import("@/pages/public-pages/Landing/Landing-page"),
);
const SignupPage = lazy(
    () => import("@/pages/public-pages/Signup/Signup-page"),
);
const LoginPage = lazy(() => import("@/pages/public-pages/Login/Login-page"));

// Client Pages
const ClientLayoutPage = lazy(
    () => import("@/layouts/Client-layout/Client-layout-page"),
);
const CreateProjectPage = lazy(
    () => import("@/pages/client-pages/Create-project/Create-project-page"),
);
const ClientDashboardPage = lazy(
    () => import("@/pages/client-pages/Client-dashboard/Client-dashboard-page"),
);
const AllProjectsClientPage = lazy(
    () =>
        import(
            "@/pages/client-pages/All-projects-client/All-projects-client-page"
        ),
);
const ProjectDetailsClientPage = lazy(
    () =>
        import(
            "@/pages/client-pages/Project-details-client/Project-details-client-page"
        ),
);
const ClientProfilePage = lazy(
    () => import("@/pages/client-pages/Client-profile/Client-profile-page"),
);
const ViewFreelancersPage = lazy(
    () => import("@/pages/client-pages/View-freelancers/View-freelancers-page"),
);
const FreelancerDetailsClientPage = lazy(
    () =>
        import(
            "@/pages/client-pages/Freelancer-details-client/Freelancer-details-client-page"
        ),
);

// Freelancer Pages
const FreelancerLayoutPage = lazy(
    () => import("@/layouts/Freelancer-layout/Freelancer-layout-page"),
);
const FreelancerDashboardPage = lazy(
    () =>
        import(
            "@/pages/freelancer-pages/Freelancer-dashboard/Freelancer-dashboard-page"
        ),
);

const FreelancerProfilePage = lazy(
    () =>
        import(
            "@/pages/freelancer-pages/Freelancer-profile/Freelancer-profile-page"
        ),
);
const FreelancerInvitesPage = lazy(
    () =>
        import(
            "@/pages/freelancer-pages/Freelancer-invites/Freelancer-invites-page"
        ),
);
const FreelancerProjectsPage = lazy(
    () =>
        import(
            "@/pages/freelancer-pages/Freelancer-projects/Freelancer-projects-page"
        ),
);
const ProjectDetailsFreelancerPage = lazy(
    () =>
        import(
            "@/pages/freelancer-pages/Project-details-freelancer/Project-details-freelancer-page"
        ),
);
const FreelancerDetailsFreelancerPage = lazy(
    () =>
        import(
            "@/pages/freelancer-pages/Freelancer-details-freelancer/Freelancer-details-freelancer-page"
        ),
);

// common pages
const ChatPage = lazy(() => import("@/pages/chat/Chat-page"));

const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "signup",
        element: <SignupPage />,
    },
    {
        path: "login",
        element: <LoginPage />,
    },
    {
        path: "client",
        element: <ClientLayoutPage />,
        children: [
            {
                index: true,
                element: <ClientDashboardPage />,
            },
            {
                path: "create-project",
                element: <CreateProjectPage />,
            },
            {
                path: "all-projects",
                element: <AllProjectsClientPage />,
            },
            {
                path: "project-details/:projectId",
                element: <ProjectDetailsClientPage />,
            },
            {
                path: "client-profile",
                element: <ClientProfilePage />,
            },
            {
                path: "view-freelancers",
                element: <ViewFreelancersPage />,
            },
            {
                path: "freelancer-details/:freelancerId",
                element: <FreelancerDetailsClientPage />,
            },
            {
                path: "chats",
                element: <ChatPage />,
            },
        ],
    },
    {
        path: "freelancer",
        element: <FreelancerLayoutPage />,
        children: [
            {
                index: true,
                element: <FreelancerDashboardPage />,
            },
            {
                path: "freelancer-profile",
                element: <FreelancerProfilePage />,
            },
            {
                path: "freelancer-invites",
                element: <FreelancerInvitesPage />,
            },
            {
                path: "freelancer-projects",
                element: <FreelancerProjectsPage />,
            },
            {
                path: "project-details/:projectId",
                element: <ProjectDetailsFreelancerPage />,
            },
            {
                path: "freelancer-details/:freelancerId",
                element: <FreelancerDetailsFreelancerPage />,
            },
            {
                path: "chats",
                element: <ChatPage />,
            },
        ],
    },
]);

const App = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RouterProvider router={router} />
            <Toaster />
        </Suspense>
    );
};

export default App;
