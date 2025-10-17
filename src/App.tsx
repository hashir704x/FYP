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

// Freelancer Pages
const FreelancerLayout = lazy(() => import("@/layouts/Freelancer-layout"));
const FreelancerDashboardPage = lazy(
    () => import("@/pages/freelancer-pages/Freelancer-dashboard-page")
);
const FreelancerProfilePage = lazy(
    () => import("@/pages/freelancer-pages/Freelancer-profile-page")
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
                path: "project-details/:project-id",
                element: <ProjectDetailsPage />,
            },
            {
                path: "client-profile",
                element: <ClientProfilePage />,
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
