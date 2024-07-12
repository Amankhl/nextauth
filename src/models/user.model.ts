import mongooose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type : String,
        required : [true, 'Username is required'],
        unique : true
    },
    email: {
        type : String,
        required : [true, 'email is required'],
        unique : true
    },
    password: {
        type : String,
        required : [true, 'password is required'],
    },
    isVerified: {
        type : Boolean,
        default : false
    },
    isAdmin: {
        type : Boolean,
        default : false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
})

// as next js runs on edge time, we need to assume that nextjs doesn't know whether the model is already there or not that's why we check if the model already exists
const User = mongooose.models.users || mongooose.model('users', userSchema);

export default User;