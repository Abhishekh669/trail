import { CaptainDataType, UserType } from "@/features/types/users";
import { create } from "zustand";



interface UserStore{
    user : UserType  | null,
    setUser : (user :  UserType | null) => void,
}


interface CaptainStore{
    user  : CaptainDataType | null,
    setUser : (user :  CaptainDataType | null) => void,
}


export const useUserStore = create<UserStore>((set,get) => ({
    user : null,
    setUser : (user : UserType  | null) => {
        set({user})
    },
}))



export const useCaptainStore = create<CaptainStore>((set, get)=>(
    {
        user : null,
        setUser : ( user : CaptainDataType | null) =>{
            set({user})
        }
    }
))


