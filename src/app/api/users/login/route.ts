import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/user.model"
import {NextRequest, NextResponse} from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

connect()

export const POST = async (req: NextRequest) => {
    try {
        const reqBody = await req.json()     // in next we don't need to use middleware for parsing the req to json data
        const {email, password} = reqBody
        //validaition - some validations can be handled by mongoose schema but we need zod for better validations e.g., password should be 6 characters long 

        console.log(reqBody)

        const user = await User.findOne({email})

        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }
        console.log("User exists")

        const validPassword = await bcrypt.compare(password, user.password)

        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }
        const tokenData = {  // for payload data. usually we only give id as the payload of a token.
            id: user._id,
            username: user.username,
            email: user.email
        }
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"}) // ! -> not null - we are sure that this will definetly have a value
        const response = NextResponse.json({
            message:"Logged In success",
            success: true})

        response.cookies.set("token", token, {  // unlike express js where we need to install external packages for cookies, next js provide cookies.
            httpOnly: true   //user can only see the cokkie but cannot manipulate it
        })

        return response
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}