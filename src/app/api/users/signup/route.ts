// in next js we need to connect database in every folder since it runs on edge time, unlike express where we just connect db only once, in next js, mainly the functions are deployed so we need to connect db in every folder 

//console logs and response generated in the api folder(backend) can only be accessed in the backend. the reponse is generated and handled by the frontend pages

import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/user.model"
import {NextRequest, NextResponse} from "next/server"
import bcrypt from "bcryptjs"
import { sendEmail } from "@/helpers/mailer"

connect()


export const POST = async (req: NextRequest) => {
    try {
        const reqBody = await req.json()     // in next we don't need to use middleware for parsing the req to json data
        const {username, email, password} = reqBody
        //validaition - some validations can be handled by mongoose schema but we need zod for better validations e.g., password should be 6 characters long 

        console.log(reqBody)

        const user = await User.findOne({email})

        if(user){
            return NextResponse.json({error: "User already exists"}, {status: 400})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        const newUser = new User({    // creating model
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()
        console.log(savedUser)

        //send verification email
        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})
        return NextResponse.json({message: "User created successfully", user: savedUser, success: true}, {status: 201})

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}
