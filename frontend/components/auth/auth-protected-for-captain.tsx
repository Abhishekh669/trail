"use client";
import { useGetUserFromToken } from "@/features/hooks/tanstack/query-hook/token/use-get-user-from-token";
import { useRideStore } from "@/features/store/ride/use-ride-store";
import {  useCaptainSocketIoStore, useUserSocketIoStore } from "@/features/store/socket/use-socket-store";
import { useCaptainStore } from "@/features/store/users/use-user-store";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthProtectedForCaptain({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: userData, isLoading: isUserLoading } =
    useGetUserFromToken("captain");
  const { user, setUser } = useCaptainStore();
  const {rides} = useRideStore()
  console.log("this ishte rides : ", rides);
  console.log("this is the user ",user)
  const { socket, connectSocket, disconnectSocket } = useCaptainSocketIoStore();
  console.log("this is socket : ",socket)

  useEffect(() => {
    if (userData?.user) {
      setUser(userData.user);
    } 
  }, [userData?.user, isUserLoading]);




  useEffect(() => {
    if (!isUserLoading && !userData?.user) {
      router.push("/auth/captain/login");
    }
  }, [isUserLoading, userData?.user, router]);


  useEffect(() => {
    if (isUserLoading || !user || socket?.connected) return;
    connectSocket();
    return () => {
      disconnectSocket();
    };
  }, [isUserLoading,  user, connectSocket, disconnectSocket]);
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
