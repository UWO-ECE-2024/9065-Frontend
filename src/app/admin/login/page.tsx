"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/common/config";
import { useActions } from "@/store/shopping-store";
import { useToast } from "@/hooks/use-toast";
import { clearUserAuth } from "@/lib/utils";

interface AdminLoginResponse {
    message: string;
    data: {
        admin: {
            adminId: number;
            email: string;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    };
}

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const updateTokens = useActions().updateTokens;
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            // First clear any existing user auth
            clearUserAuth();

            const response = await fetch(`${API_URL}/v1/admin-auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.error?.issues?.[0]?.message || "Login failed"
                );
            }

            const data: AdminLoginResponse = await response.json();

            updateTokens(data.data.tokens);
            // Save the tokens with admin prefix
            localStorage.setItem("adminToken", data.data.tokens.accessToken);
            localStorage.setItem("adminRefreshToken", data.data.tokens.refreshToken);

            toast({
                title: "Success",
                description: "Logged in successfully",
            });

            // Redirect to stock system
            router.push("/stock-system");
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
            toast({
                title: "Error",
                description: err instanceof Error ? err.message : "An error occurred",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Admin Login</CardTitle>
                    <CardDescription>
                        Enter your credentials to access the admin panel
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                        <div className="text-center text-sm">
                            Need an admin account?{" "}
                            <Link
                                href="/admin/register"
                                className="text-blue-500 hover:text-blue-600"
                            >
                                Register here
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}