import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "./components/ui/sonner";

// Public Pages
const LandingPage = lazy(() => import("@/pages/public-pages/Landing-page"));
const SignupPage = lazy(() => import("@/pages/public-pages/Signup-page"));
const LoginPage = lazy(() => import("@/pages/public-pages/Login-page"));

// Client Pages
const ClientLayout = lazy(() => import("@/layouts/Client-layout"));
const CreateProjectPage = lazy(() => import("@/pages/client-pages/Create-project-page"));
const ClientDashboardPage = lazy(
    () => import("@/pages/client-pages/Client-dashboard-page")
);
const AllProjectsPage = lazy(() => import("@/pages/client-pages/All-projects-page"));
const ProjectDetailsPage = lazy(
    () => import("@/pages/client-pages/Project-details-page")
);
const ClientProfilePage = lazy(() => import("@/pages/client-pages/Client-profile-page"));
const ViewFreelancersPage = lazy(
    () => import("@/pages/client-pages/View-freelancers-page")
);
const FreelancerDetailsPage = lazy(
    () => import("@/pages/client-pages/Freelancer-details-page")
);

// Freelancer Pages
const FreelancerLayout = lazy(() => import("@/layouts/Freelancer-layout"));
const FreelancerDashboardPage = lazy(
    () => import("@/pages/freelancer-pages/Freelancer-dashboard-page")
);
const FreelancerProfilePage = lazy(
    () => import("@/pages/freelancer-pages/Freelancer-profile-page")
);
const FreelancerInvitesPage = lazy(
    () => import("@/pages/freelancer-pages/Freelancer-invites-page")
);

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
        element: <ClientLayout />,
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
                element: <AllProjectsPage />,
            },
            {
                path: "project-details/:projectId",
                element: <ProjectDetailsPage />,
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
                element: <FreelancerDetailsPage />,
            },
        ],
    },
    {
        path: "freelancer",
        element: <FreelancerLayout />,
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
