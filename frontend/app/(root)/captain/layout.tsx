import AuthProtectedForCaptain from "@/components/auth/auth-protected-for-captain";

export default function CaptainDashboardLayout({children} : {children : React.ReactNode}){

    return(
        <AuthProtectedForCaptain>
            {children}
        </AuthProtectedForCaptain>
    )
}