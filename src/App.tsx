import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Toaster } from "./components/ui/sonner";

const LandingPage = lazy(() => import("@/pages/public-pages/Landing-page"));
const SignupPage = lazy(() => import("@/pages/public-pages/Signup-page"));
const LoginPage = lazy(() => import("@/pages/public-pages/Login-page"));
const ClientLayout = lazy(() => import("@/layouts/Client-layout"));
const CreateProjectPage = lazy(() => import("@/pages/client-pages/Create-project-page"));
const ClientDashboard = lazy(() => import("@/pages/client-pages/Client-dashboard-page"));
const AllProjectsPage = lazy(() => import("@/pages/client-pages/All-projects-page"));
const ProjectDetailsPage = lazy(
    () => import("@/pages/client-pages/Project-details-page")
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
                element: <ClientDashboard />,
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
