import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SimpleNavbar() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        router.push("/login");
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold">
                            Home
                        </Link>
                    </div>
                    <div className="flex items-center">
                        <Button
                            onClick={handleLogout}
                            variant="ghost"
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}