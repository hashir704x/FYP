import { userAuthStore } from "@/store/user-auth-store";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabaseClient } from "@/Supabase-client";
import { Spinner } from "@/components/ui/spinner";

const LoginPage = () => {
    const userExists = userAuthStore((state) => state.userExists);
    const user = userAuthStore((state) => state.user);
    const setUser = userAuthStore((state) => state.setUser);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [password, setPassword] = useState("");

    useEffect(() => {
        if (userExists && user) {
            if (user.role === "client") navigate("/client");
            else if (user.role === "freelancer") navigate("/freelancer");
        }
    }, []);

    async function handleLogin(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.preventDefault();

        if (!email || !password) {
            toast.warning("Feilds are empty!");
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

        const initialResponse = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (initialResponse.error) {
            setLoading(false);
            toast.error(`Login failed, ${initialResponse.error.message}`);
            console.log("error message:", initialResponse.error.message);
            return;
        }

        const userId = initialResponse.data.user?.id;
        if (userId) {
            const middleResponse = await supabaseClient
                .from("user_roles")
                .select("*")
                .eq("id", userId)
                .single();

            if (middleResponse.error) {
                setLoading(false);
                toast.error(`Login failed, ${middleResponse.error.message}`);
                console.log("error message:", middleResponse.error.message);
                return;
            }

            let readFromTable: "freelancers" | "clients" = "clients";
            if (middleResponse.data.role === "freelancer") readFromTable = "freelancers";

            const finalResponse = await supabaseClient
                .from(readFromTable)
                .select("*")
                .eq("id", userId)
                .single();

            setUser({
                email: finalResponse.data.email,
                role: finalResponse.data.role,
                username: finalResponse.data.username,
                userId: finalResponse.data.id,
                wallet_amount: finalResponse.data.wallet_amount,
                profile_pic: finalResponse.data.profile_pic,
            });

            setLoading(false);

            if (finalResponse.data.role === "freelancer") {
                navigate("/freelancer");
                return;
            } else {
                navigate("/client");
                return;
            }
        } else {
            setLoading(false);
            toast.error("Login failed, something went wrong!");
            return;
        }
    }

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="border-2 xl:w-[400px] w-[350px] p-4 rounded-xl shadow-2xl">
                <div>
                    <h1 className="text-xl text-center sm:text-3xl font-medium">Login</h1>
                    <p className="text-center text-sm mt-1">
                        New here?{" "}
                        <Link to="/signup">
                            <span className="underline cursor-pointer">
                                Create account
                            </span>
                        </Link>
                    </p>
                </div>

                <form className="mt-4 flex flex-col gap-4">
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

                    <Button
                        disabled={loading}
                        onClick={handleLogin}
                        variant="custom"
                        className="mt-4 cursor-pointer"
                    >
                        {loading && <Spinner />}
                        Login
                    </Button>
                </form>
            </div>
        </div>
    );
};
export default LoginPage;
