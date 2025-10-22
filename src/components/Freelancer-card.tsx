import type { FreelancerFromBackendType } from "@/Types";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import InviteFreelancerConfirmDialog from "./Invite-freelancer-confirm-dialog";

export default function FreelancerCard(props: FreelancerFromBackendType) {
    const location = useLocation();

    return (
        <div
            className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-4 flex flex-col w-[300px] justify-between ${
                location.pathname.includes("/client/project-details")
                    ? "h-[360px]"
                    : "h-[330px]"
            } `}
        >
            <div className="flex items-center gap-4">
                <img src={props.profile_pic} alt="profile-pic" className="w-[120px] rounded-full object-cover" />

                <div className="flex flex-col items-center font-semibold">
                    <h3 className="text-lg  text-gray-800">{props.username}</h3>
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
                <Button variant="outline" className="mt-3 w-full hover:bg-gray-100 cursor-pointer">
                    View Profile
                </Button>
            </Link>

            {location.pathname.includes("/client/project-details") && (
                <InviteFreelancerConfirmDialog freelancerId={props.id} />
            )}
        </div>
    );
}
