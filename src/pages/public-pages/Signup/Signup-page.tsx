import { userAuthStore } from "@/store/user-auth-store";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { UserRoleType } from "@/Types";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabaseClient } from "@/Supabase-client";
import SkillsPicker from "@/components/Skills-picker";
import { Spinner } from "@/components/ui/spinner";

const SignupPage = () => {
    const userExists = userAuthStore((state) => state.userExists);
    const user = userAuthStore((state) => state.user);
    const setUser = userAuthStore((state) => state.setUser);

    const navigate = useNavigate();
    const [role, setRole] = useState<UserRoleType | "">();
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (userExists && user) {
            if (user.role === "client") navigate("/client");
            else if (user.role === "freelancer") navigate("/freelancer");
        }
    }, []);

    async function handleSignup(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        if (!username || !email || !password || !role) {
            toast.warning("Feilds are empty!");
            return;
        }

        if (role === "freelancer" && (skills.length === 0 || !description)) {
            toast.warning("Feilds are empty!");
            return;
        }

        if (username.length < 3) {
            toast.warning("Username is too short!");
            return;
        }

        if (password.length < 6) {
            toast.warning("Password should be atleast 6 letters!");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            toast.warning("Invalid email address");
            return;
        }

        setLoading(true);

        const initialResponse = await supabaseClient.auth.signUp({
            email: email,
            password: password,
        });

        if (initialResponse.error) {
            setLoading(false);
            console.log("initial error");
            toast.error(`Signup failed, ${initialResponse.error.message}`);
            console.log("error message:", initialResponse.error.message);
            return;
        }

        const userId = initialResponse.data.user?.id;

        if (userId) {
            const middleResponse = await supabaseClient.from("user_roles").insert({
                id: userId,
                role: role,
            });

            if (middleResponse.error) {
                setLoading(false);
                toast.error(`Signup failed, ${middleResponse.error.message}`);
                console.log("error message:", middleResponse.error.message);
                return;
            }

            if (role === "client") {
                const finalResponse = await supabaseClient
                    .from("clients")
                    .insert({
                        id: userId,
                        username: username,
                        email: email,
                    })
                    .select()
                    .single();

                setUser({
                    email: finalResponse.data.email,
                    role: finalResponse.data.role,
                    username: finalResponse.data.username,
                    userId: finalResponse.data.id,
                    wallet_amount: finalResponse.data.wallet_amount,
                    profile_pic: finalResponse.data.profile_pic,
                });

                toast.success("Account created successfully");
                navigate("/client");
                setLoading(false);
                return;
            } else {
                const finalResponse = await supabaseClient
                    .from("freelancers")
                    .insert({
                        id: userId,
                        username: username,
                        email: email,
                        skills: skills,
                        description: description,
                    })
                    .select()
                    .single();

                setUser({
                    email: finalResponse.data.email,
                    role: finalResponse.data.role,
                    username: finalResponse.data.username,
                    userId: finalResponse.data.id,
                    wallet_amount: finalResponse.data.wallet_amount,
                    profile_pic: finalResponse.data.profile_pic,
                });
                
                toast.success("Account created successfully");
                navigate("/freelancer");
                setLoading(false);
                return;
            }
        } else {
            toast.error("Signup failed, something went wrong!");
            setLoading(false);
            return;
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen xl:p-3">
            <div className="border-2 xl:w-[450px] w-[350px] p-4 rounded-xl shadow-2xl">
                <div>
                    <h1 className="text-xl text-center sm:text-3xl font-medium">
                        Create an account
                    </h1>
                    <p className="text-center text-sm mt-1">
                        Already have an account?{" "}
                        <Link to="/login">
                            <span className="underline cursor-pointer">Login</span>
                        </Link>
                    </p>
                </div>

                <form className="mt-4 flex flex-col gap-4">
                    <div>
                        <label htmlFor="username" className="text-sm">
                            Username
                        </label>
                        <Input
                            id="username"
                            placeholder="Enter username"
                            className="mt-1"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="text-sm">
                            Email
                        </label>
                        <Input
                            type="email"
                            id="email"
                            placeholder="Enter email"
                            className="mt-1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="text-sm">
                            Password
                        </label>
                        <Input
                            type={`${showPassword ? "text" : "password"}`}
                            id="password"
                            placeholder="Enter password"
                            className="mt-1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <span
                            className="absolute right-2.5 bottom-1.5 sm:bottom-1.5 cursor-pointer"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>

                    <div>
                        <p className="mb-1 text-sm">Select your role</p>
                        <Select
                            value={role}
                            onValueChange={(value: UserRoleType) => setRole(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent className="">
                                <SelectItem value="client">Client</SelectItem>
                                <SelectItem value="freelancer">Freelancer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {role && role === "freelancer" && (
                        <div>
                            <div>
                                <label htmlFor="freelancer-desc" className="text-sm">
                                    Description
                                </label>
                                <textarea
                                    id="freelancer-desc"
                                    rows={5}
                                    placeholder="Describe your work or profession"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1 border border-gray-300 rounded-md px-3 py-2 outline-none resize-none w-full"
                                />
                            </div>

                            <div>
                                <p className="text-sm mb-1">Pick your skills</p>
                                <SkillsPicker value={skills} onChange={setSkills} />
                            </div>
                        </div>
                    )}

                    <Button
                        disabled={loading}
                        onClick={handleSignup}
                        variant="custom"
                        className="mt-4 cursor-pointer"
                    >
                        {loading && <Spinner />}
                        Create Account
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
