import type { FreelancerFromBackendType, UserType } from "@/Types";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import InviteFreelancerConfirmDialog from "./Invite-freelancer-confirm-dialog";
import { userAuthStore } from "@/store/user-auth-store";

type PropsType = {
    freelancerData: FreelancerFromBackendType;
    showInviteButton: boolean;
};

export default function FreelancerCard(props: PropsType) {
    const user = userAuthStore((state) => state.user) as UserType;
    return (
        <div
            className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 p-4 flex flex-col w-[300px] justify-between ${
                props.showInviteButton ? "h-[360px]" : "h-[330px]"
            } `}
        >
            <div className="flex items-center gap-4">
                <img
                    src={props.freelancerData.profile_pic}
                    alt="profile-pic"
                    className="w-32 h-32 rounded-full object-cover border-2 border-[var(--my-blue)]"
                />

                <div className="flex flex-col items-center font-semibold">
                    <h3 className="text-lg  text-gray-800">
                        {props.freelancerData.username}
                    </h3>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mt-1">
                {props.freelancerData.description.length > 100
                    ? props.freelancerData.description.slice(0, 100) + "..."
                    : props.freelancerData.description}
            </p>

            {/* Skills */}
            <div className="w-full flex flex-wrap gap-2 mt-2">
                {props.freelancerData.skills.slice(0, 3).map((skill, i) => (
                    <span
                        key={i}
                        className="text-xs bg-gray-100 text-[var(--my-blue)] font-medium px-2.5 py-1 rounded-full border border-gray-200"
                    >
                        {skill}
                    </span>
                ))}
            </div>

            {user.role === "freelancer" && user.userId === props.freelancerData.id ? (
                <Link to="/freelancer/freelancer-profile">
                    <Button
                        variant="outline"
                        className="mt-3 w-full hover:bg-gray-100 cursor-pointer"
                    >
                        View my profile
                    </Button>
                </Link>
            ) : (
                <Link
                    to={`/${
                        user.role === "client" ? "client" : "freelancer"
                    }/freelancer-details/${props.freelancerData.id}`}
                >
                    <Button
                        variant="outline"
                        className="mt-3 w-full hover:bg-gray-100 cursor-pointer"
                    >
                        View Profile
                    </Button>
                </Link>
            )}

            {/* Action Button */}

            {props.showInviteButton && (
                <InviteFreelancerConfirmDialog freelancerId={props.freelancerData.id} />
            )}
        </div>
    );
}
