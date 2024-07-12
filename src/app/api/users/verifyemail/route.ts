import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/user.model"
import {NextRequest, NextResponse} from "next/server"


connect()

export const POST = async (req: NextRequest) => {
    try {
        const reqBody = await req.json()
        const {token} = reqBody
        console.log(token)
        
        // token verification - fetching data from db by using the token from the email
        const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}})

        if(!user){
            return NextResponse.json({error: "Invalid token"}, {status: 400})
        }
        console.log(user)
        
        //now we do not need the token data stored in the db and isVerified to 'true'
        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined

        await user.save()

        return NextResponse.json({message: "Email verified successfully", success: true}, {status: 200})

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}