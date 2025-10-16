import TechPicker from "@/components/Tech-picker";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { userAuthStore } from "@/store/user-auth-store";
import { useMutation } from "@tanstack/react-query";
import { createProject } from "@/api-functions/project-functions";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const CreateProjectPage = () => {
    const user = userAuthStore((state) => state.user);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [budget, setBudget] = useState<number>(0);
    const [techs, setTechs] = useState<string[]>([]);

    const queryClient = useQueryClient();

    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationFn: createProject,
        onSuccess: (projectId) => {
            toast.success("Project created successfully");
            setTitle("");
            setDesc("");
            setBudget(0);
            setTechs([]);
            queryClient.invalidateQueries({ queryKey: ["get-all-projects"] });
            navigate(`/client/project-details/${projectId}`);
        },
        onError: (error) => {
            console.log(error);
            toast.error("Project creation failed");
        },
    });

    function handleCreateProject(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!title || !desc || techs.length === 0) {
            toast.warning("Fields are empty");
            return;
        }

        if (title.length < 4) {
            toast.warning("Project title must atleast 4 letters long");
            return;
        }

        if (budget < 5000) {
            toast.warning("Budget must be min Rs 5000");
            return;
        }

        if (user) {
            mutate({
                project_title: title,
                project_description: desc,
                project_budget: budget,
                required_skills: techs,
                client_id: user.userId,
            });
        }
    }

    return (
        <div className="min-h-screen border-2 border-red-400">
            <h1 className="text-3xl font-semibold h-[70px] px-4 border-b flex items-center">
                Create Project
            </h1>
            <div className="max-w-2xl mx-auto mt-8 shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)] rounded-md p-6">
                <h1 className="text-2xl font-semibold text-[var(--my-blue)]">
                    Create your new project
                </h1>

                <form onSubmit={handleCreateProject} className="bg-white space-y-5 mt-2">
                    <div className="flex flex-col space-y-2">
                        <label htmlFor="title" className="font-medium text-gray-700">
                            Project Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            placeholder="e.g. E-commerce Website"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--my-blue)]"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="desc" className="font-medium text-gray-700">
                            Project Description
                        </label>
                        <textarea
                            id="desc"
                            rows={5}
                            placeholder="Describe your project in detail..."
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 outline-none resize-none focus:ring-2 focus:ring-[var(--my-blue)]"
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label className="font-medium text-gray-700">
                            Required Technologies
                        </label>
                        <TechPicker value={techs} onChange={setTechs} />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <label htmlFor="budget" className="font-medium text-gray-700">
                            Estimated Budget (min Rs 5000)
                        </label>
                        <input
                            id="budget"
                            type="number"
                            min={0}
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value))}
                            className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--my-blue)]"
                        />
                    </div>

                    <Button disabled={isPending} variant="custom" type="submit">
                        {isPending && <Spinner />}
                        Create Project
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectPage;
