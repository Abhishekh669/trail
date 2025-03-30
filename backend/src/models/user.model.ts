import  jwt  from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcryptjs"


const userSchema = new mongoose.Schema({
    fullName : {
        firstName : {
            type : String,
            required : true,
            minlength : [3, 'first name must be of at least of 3 characters long']
        },
        lastName : {
            type : String,
            minlength : [3, 'last name must be of 3 characters long']
        }
    },
    email : {
        type : String,
        required : true,
        unique : true,
        minlength : [5, 'email must be at leat 5 letter long']
    },

    password: {
        type: String,
        required: true,
        select: false,
    },

    socketId : {
        type : String,
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    

})


userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id : this._id},process.env.JWT_SECRET!,{expiresIn : '24h'});
    return token;
}


userSchema.methods.comparePassword = async function (password : string) {
    return await bcrypt.compare(password, this.password);
}





export const User = mongoose.models.User || mongoose.model("User", userSchema)


