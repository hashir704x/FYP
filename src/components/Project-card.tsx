import { type ProjectsFromBackendType } from "@/Types";
import { Link } from "react-router-dom";

const ProjectCard = (props: ProjectsFromBackendType) => {
    return (
        <div className="border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-xl transition-all duration-300 w-[320px] flex flex-col justify-between">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 truncate">
                {props.project_title}
            </h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {props.project_description.length > 100
                    ? props.project_description.slice(0, 100) + "..."
                    : props.project_description}
            </p>

            {/* Budget & Status */}
            <div className="flex justify-between items-center mt-4">
                <span className="text-gray-700 font-medium">
                    💰 Rs {props.project_budget.toLocaleString()}
                </span>
                <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        props.project_status === "DRAFT"
                            ? "bg-yellow-100 text-yellow-800"
                            : props.project_status === "IN_PROGRESS"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                    }`}
                >
                    {props.project_status.replace("_", " ")}
                </span>
            </div>

            {/* Required Skills */}
            <div className="flex flex-wrap gap-2 mt-3 items-center">
                {props.required_skills.slice(0, 3).map((skill) => (
                    <span
                        key={skill}
                        className="font-medium bg-blue-100 text-[var(--my-blue)] text-xs px-2 py-1 rounded-full"
                    >
                        {skill}
                    </span>
                ))}
                {props.required_skills.length > 3 && (
                    <span className="text-gray-500 text-xs">
                        +{props.required_skills.length - 3}
                    </span>
                )}
            </div>

            {/* Created at */}
            <p className="text-gray-400 text-xs mt-3">
                Created: {new Date(props.created_at).toLocaleDateString()}
            </p>

            <Link to={`/client/project-details/${props.project_id}`}>
                <button className="cursor-pointer hover:bg-[var(--my-blue-light)] mt-3 bg-[var(--my-blue)] py-2 px-3 text-white text-xs rounded-full w-full transition-all duration-300">
                    Open
                </button>
            </Link>
        </div>
    );
};

export default ProjectCard;
