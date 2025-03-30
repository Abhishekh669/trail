import { cookies } from "next/headers";

export const get_cookies  = async (name : string)=>{
    const cookieStore = await cookies();
    const token = cookieStore.get(name);
    return token;
}