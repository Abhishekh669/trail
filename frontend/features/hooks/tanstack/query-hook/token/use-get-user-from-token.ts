import { getUserFromToken } from "@/features/actions/user/user";
import { useQuery } from "@tanstack/react-query";

export  const fetch_user_from_token = async(userType : string) =>{
    const response = await getUserFromToken(userType);
    return {
        message : response.message,
        user : JSON.parse(response.user as string)
    };
}

export const useGetUserFromToken = (userType : string) =>{
    return useQuery({
        queryKey : ["get_user_from_token"],
        queryFn : () => fetch_user_from_token(userType),
    })
}