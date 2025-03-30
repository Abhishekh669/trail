"use client";
import { useGetUserFromToken } from "@/features/hooks/tanstack/query-hook/token/use-get-user-from-token";
import { useUserSocketIoStore } from "@/features/store/socket/use-socket-store";
import { useUserStore } from "@/features/store/users/use-user-store";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthProtectedForUser({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: userData, isLoading: isUserLoading } =
    useGetUserFromToken("user");
  const { setUser } = useUserStore();
  const { socket, connectSocket, disconnectSocket } = useUserSocketIoStore();
  console.log("this is socket : ",socket)
  useEffect(() => {
    if (isUserLoading || !userData?.user || socket?.connected) return;
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, [isUserLoading,  userData?.user, connectSocket, disconnectSocket]);
  useEffect(() => {
    if (userData?.user) {
      setUser(userData.user);
    } 
  }, [userData?.user, isUserLoading]);

  useEffect(() => {
    if (!isUserLoading && !userData?.user) {
      router.push("/auth/user/login");
    }
  }, [isUserLoading, userData?.user, router]);
  if (isUserLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }
  if (!userData?.user) {
    return null;
  }

  return <>{children}</>;
}
