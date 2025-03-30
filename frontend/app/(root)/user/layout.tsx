"use client"
import AuthProtectedForUser from "@/components/auth/auth-protected-for-user";
export default function UserDashboardLayout({children} : {children : React.ReactNode}){
   
    return(
        <AuthProtectedForUser>
            {children}
        </AuthProtectedForUser>
    )
}   