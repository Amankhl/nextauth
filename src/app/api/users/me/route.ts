import {connect} from "@/dbConfig/dbConfig"
import User from "@/models/user.model"
import {NextRequest, NextResponse} from "next/server"
import { getDataFromToken } from "@/helpers/getDataFromToken"

connect()


export const GET = async (req: NextRequest) => {
    // extract data from token
    const userId = await getDataFromToken(req)
    if(!userId){
        throw new Error("Invalid token in me route")
    }
    const user = await User.findOne({_id: userId}).select("-password")
    return NextResponse.json({
        message: "User found",
        data: user
    })
}