import { CreateUserType, loginUserType } from "../lib/types";
import { User } from "../models/user.model";


export const createUser = async({firstName, lastName, email, password} : CreateUserType) =>{
    if(!firstName || !email || !password){
        throw new Error("All fields are required")
    }

   
    const newUser = await User.create({
        fullName : {firstName,lastName},
        email,
        password,
    })

    return newUser;

}


