import type { FreelancerFromBackendType } from "@/Types";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import AddFreelancerConfirmDialog from "./Add-freelancer-confirm-dialog";

export default function FreelancerCard(props: FreelancerFromBackendType) {
    const location = useLocation();

    return (
        <div
            className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-4 flex flex-col w-[300px] justify-between ${
                location.pathname.includes("/client/project-details")
                    ? "h-[370px]"
                    : "h-[330px]"
            } `}
        >
            <div className="flex items-center gap-4">
                <img src={props.profile_pic} alt="profile-pic" className="w-[120px]" />

                <div className="flex flex-col items-center font-semibold">
                    <h3 className="text-lg  text-gray-800">{props.username}</h3>
                    <p className="text-sm text-gray-500">{props.email}</p>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mt-1">
                {props.description.length > 100
                    ? props.description.slice(0, 100) + "..."
                    : props.description}
            </p>

            {/* Skills */}
            <div className="w-full flex flex-wrap gap-2 mt-2">
                {props.skills.slice(0, 3).map((skill, i) => (
                    <span
                        key={i}
                        className="text-xs bg-gray-100 text-[var(--my-blue)] font-medium px-2.5 py-1 rounded-full border border-gray-200"
                    >
                        {skill}
                    </span>
                ))}
            </div>

            {/* Action Button */}
            <Link to={`/client/freelancer-details/${props.id}`}>
                <Button variant="custom" className="mt-2 w-full">
                    View Profile
                </Button>
            </Link>

            {location.pathname.includes("/client/project-details") && (
                <AddFreelancerConfirmDialog freelancerId={props.id} />
            )}
        </div>
    );
}
