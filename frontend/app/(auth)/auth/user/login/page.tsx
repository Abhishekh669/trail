import { LoginForm } from "@/components/auth/user/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div  className="flex flex-col gap-y-10 items-center justify-center h-screen">
          <LoginForm />
          <div>
            <Link href="/auth/captain/login" className="text-sm bg-green-500 p-3 rounded-md text-white text-muted-foreground hover:text-primary">Are you a captain? Login here</Link>
          </div>
    </div>
  )
} 