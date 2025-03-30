import { CaptainLoginForm } from "@/components/auth/captain/login-form";
import Link from "next/link";

export default function CaptainLoginPage() {
    return <div className="flex gap-y-10 flex-col items-center justify-center h-screen">
        <CaptainLoginForm />
        <div>
            <Link href="/auth/user/login" className="text-sm bg-green-500 p-3 rounded-md text-white text-muted-foreground hover:text-primary">Are you Rider? Login here</Link>
        </div>
    </div>
}